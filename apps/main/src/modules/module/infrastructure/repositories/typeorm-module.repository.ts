import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { Module } from '@module-module/domain/aggregate/module';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListModule } from '@module-module/domain/list-module';
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

    if (partialSchema.project) {
      const objectId = new ObjectId(partialSchema.project);

      partialSchema = {
        ...partialSchema,
        project: objectId,
      };
    }

    if (partialSchema?.subModules?.length && partialSchema?.subModules.length > 0) {
      const subModules = partialSchema.subModules.map((subModule) => new ObjectId(subModule));

      partialSchema = {
        ...partialSchema,
        subModules,
      };
    }

    if (partialSchema.id) {
      const objectId = new ObjectId(partialSchema.id);

      partialSchema = {
        ...partialSchema,
        _id: objectId,
      };

      const module = (await this.moduleRepository.findOneAndReplace({ _id: objectId }, partialSchema, {
        returnDocument: 'after',
      })) as ModuleEntity;

      model.fromPrimitives({
        ...module,
        ...(module.project && { project: module.project.toHexString() }),
        ...(module.subModules && { subModules: module.subModules.map((subModule) => subModule.toHexString()) }),
        id: module._id.toHexString(),
      });

      return model;
    }

    const module = await this.moduleRepository.save(partialSchema);

    model.fromPrimitives({
      ...module,
      ...(module.project && { project: { id: module.project.toHexString() } }),
      ...(module.subModules && { subModules: module.subModules.map((subModule) => subModule.toHexString()) }),
      id: module._id.toHexString(),
    });

    return model;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const module = await this.moduleRepository.findOne({ where: { name }, withDeleted: true });

    return !module;
  }

  async searchOneBy(id: string, options: { withDeleted: false }): Promise<Module | null> {
    const moduleFound = await this.moduleRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: options.withDeleted,
    });

    if (!moduleFound) {
      return null;
    }

    const module = new Module({
      ...moduleFound,
      ...(moduleFound.project && { project: moduleFound.project.toHexString() }),
      ...(moduleFound.subModules && { subModules: moduleFound.subModules.map((subModule) => subModule.toHexString()) }),
      id: moduleFound._id.toHexString(),
    });

    return module;
  }

  async delete(id: string): Promise<void> {
    await this.moduleRepository.delete({ _id: new ObjectId(id) });
  }

  async searchListBy(criteria: Criteria): Promise<ListModule> {
    const query = this.getQueryByCriteria(criteria);

    const [modules, total] = await this.moduleRepository.findAndCount(query);

    const modulesClean = modules.map((module) => ({
      ...module,
      ...(module.project && { project: module.project.toHexString() }),
      ...(module.subModules && { subModules: module.subModules.map((subModule) => subModule.toHexString()) }),
      id: module._id.toHexString(),
    }));

    const list = new ListModule(modulesClean, total);

    return list;
  }

  async softDeleteBy(model: Module): Promise<number | undefined> {
    model.disable();

    let partialSchema: Partial<IModuleSchema & ModuleEntity> = model.entityRootPartial();

    if (partialSchema?.project?.id) {
      const { id } = partialSchema.project;
      const objectId = new ObjectId(id);

      partialSchema = {
        ...partialSchema,
        project: objectId,
      };
    }

    const { id, ...partialParams } = partialSchema;

    const result = await this.moduleRepository.updateOne({ _id: new ObjectId(id) }, { $set: partialParams });

    if (result.modifiedCount === 0) {
      throw new InternalServerErrorException('The project could not be deleted');
    }

    return result.modifiedCount;
  }

  async getListByIds(ids: string[]): Promise<ListModule> {
    const idsFormatted = ids.map((id) => new ObjectId(id));

    const modules = await this.moduleRepository.find({
      where: { _id: { $in: idsFormatted } },
      withDeleted: true,
    });

    const modulesMapped = modules.map((module) => ({
      ...module,
      ...(module.project && { project: module.project.toHexString() }),
      ...(module.subModules && { subModules: module.subModules.map((subModule) => subModule.toHexString()) }),
      id: module._id.toHexString(),
    }));

    const list = new ListModule(modulesMapped, modulesMapped.length);

    return list;
  }
}
