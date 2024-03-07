import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListSubModule } from '@module-sub-module/domain/list-sub-module';

@Injectable()
export class TypeOrmSubModuleRepository extends TypeormRepository<SubModuleEntity> implements ISubModuleRepository {
  constructor(
    @InjectRepository(SubModuleEntity)
    private readonly subModuleRepository: MongoRepository<SubModuleEntity>,
  ) {
    super();
  }

  async searchOneBy(id: string, options: { withDeleted: false }): Promise<SubModule | null> {
    const subModuleFound = await this.subModuleRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: options.withDeleted,
    });

    if (!subModuleFound) {
      return null;
    }

    const subModule = new SubModule({
      ...subModuleFound,
      ...(subModuleFound.module && { module: subModuleFound.module.toHexString() }),
      id: subModuleFound._id.toHexString(),
    });

    return subModule;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const subModuleFound = await this.subModuleRepository.findOne({ where: { name } });

    return !subModuleFound;
  }

  async persist(model: SubModule): Promise<SubModule> {
    let partialSchema: Partial<ISubModuleSchema & SubModuleEntity> = model.entityRootPartial();

    if (partialSchema.module) {
      const { id } = partialSchema.module;
      const moduleId = new ObjectId(id);

      partialSchema = {
        ...partialSchema,
        module: moduleId,
      };
    }

    if (partialSchema.id) {
      const objectId = new ObjectId(partialSchema.id);

      partialSchema = {
        ...partialSchema,
        _id: objectId,
      };

      await this.subModuleRepository.updateOne({ _id: objectId }, { $set: partialSchema });

      return model;
    }

    const subModule = await this.subModuleRepository.save(partialSchema);

    model.fromPrimitives({
      ...subModule,
      ...(subModule.module && { module: { id: subModule.module.toHexString() } }),
      id: subModule._id.toHexString(),
    });

    return model;
  }

  async delete(id: string): Promise<void> {
    await this.subModuleRepository.delete({ _id: new ObjectId(id) });
  }

  async searchListBy(criteria: Criteria): Promise<ListSubModule> {
    const query = this.getQueryByCriteria(criteria);

    const [subModules, total] = await this.subModuleRepository.findAndCount(query);

    const subModulesMapped = subModules.map((subModule) => ({
      ...subModule,
      ...(subModule.module && { module: subModule.module.toHexString() }),
      id: subModule._id.toHexString(),
    }));

    const list = new ListSubModule(subModulesMapped, total);

    return list;
  }

  async softDeleteBy(model: SubModule): Promise<number | undefined> {
    model.disable();

    let partialSchema: Partial<ISubModuleSchema & SubModuleEntity> = model.entityRootPartial();

    if (partialSchema?.module?.id) {
      const { id } = partialSchema.module;
      const objectId = new ObjectId(id);

      partialSchema = {
        ...partialSchema,
        module: objectId,
      };
    }

    const { id, ...partialParams } = partialSchema;

    const result = await this.subModuleRepository.updateOne({ _id: new ObjectId(id) }, { $set: partialParams });

    if (result.modifiedCount === 0) {
      throw new InternalServerErrorException('The project could not be deleted');
    }

    return result.modifiedCount;
  }
}
