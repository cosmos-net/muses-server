import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { IModuleSchema, Module } from '@module-module/domain/aggregate/module';
@Injectable()
export class TypeOrmModuleRepository extends TypeormRepository<ModuleEntity> implements IModuleRepository {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: MongoRepository<ModuleEntity>,
  ) {
    super();
  }

  async persist(model: Module): Promise<Module> {
    let partialSchema: Partial<IModuleSchema & ModuleEntity> = model.entityRootPartial();

    if (partialSchema.project.id) {
      const { id } = partialSchema.project;
      const objectId = new ObjectId(id);

      partialSchema = {
        ...partialSchema,
        project: objectId,
      };
    }

    if (partialSchema.id) {
      const objectId = new ObjectId(partialSchema.id);

      partialSchema = {
        ...partialSchema,
        _id: objectId,
      };

      await this.moduleRepository.updateOne({ _id: objectId }, { $set: partialSchema });

      return model;
    }

    const module = await this.moduleRepository.save(partialSchema);

    model.fromPrimitives({
      ...module,
      ...(module.project && { project: { id: module.project.toHexString() } }),
      id: module._id.toHexString(),
    });

    return model;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const module = await this.moduleRepository.findOne({ where: { name } });

    return !module;
  }
}
