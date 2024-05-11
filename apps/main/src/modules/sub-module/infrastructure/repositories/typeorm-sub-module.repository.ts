import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListSubModule } from '@module-sub-module/domain/aggregate/list-sub-module';

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
      ...(subModuleFound.actions && { actions: subModuleFound.actions.map((action) => action.toHexString()) }),
      id: subModuleFound._id.toHexString(),
    });

    return subModule;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const subModuleFound = await this.subModuleRepository.findOne({ where: { name }, withDeleted: true });

    return !subModuleFound;
  }

  async persist(model: SubModule): Promise<SubModule> {
    let partialSchema: Partial<ISubModuleSchema & SubModuleEntity> = model.entityRootPartial();

    if (partialSchema.module) {
      const { module, ...restParams } = partialSchema;
      const moduleId = new ObjectId(module);

      partialSchema = {
        ...restParams,
        module: moduleId,
      };
    }

    if (partialSchema.actions) {
      const actionsIds = partialSchema.actions.map((action) => new ObjectId(action));

      partialSchema = {
        ...partialSchema,
        actions: actionsIds,
      };
    }

    if (partialSchema.id) {
      const { id, ...restParams } = partialSchema;
      const _id = new ObjectId(id);

      const subModule = (await this.subModuleRepository.findOneAndReplace(
        { _id },
        { ...restParams, updatedAt: new Date() },
        {
          returnDocument: 'after',
        },
      )) as SubModuleEntity;

      model.fromPrimitives({
        ...subModule,
        ...(subModule.module && { module: subModule.module.toHexString() }),
        id: subModule._id.toHexString(),
      });

      return model;
    }

    const subModule = await this.subModuleRepository.save(partialSchema);

    model.fromPrimitives({
      ...subModule,
      ...(subModule.module && { module: subModule.module.toHexString() }),
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

  async getListByIds(ids: string[]): Promise<ListSubModule> {
    const idsFormatted = ids.map((id) => new ObjectId(id));

    const subModules = await this.subModuleRepository.find({
      where: { _id: { $in: idsFormatted } },
      withDeleted: true,
    });

    const subModulesMapped = subModules.map((subModule) => ({
      ...subModule,
      ...(subModule.module && { module: subModule.module.toHexString() }),
      id: subModule._id.toHexString(),
    }));

    const list = new ListSubModule(subModulesMapped, subModulesMapped.length);

    return list;
  }
}
