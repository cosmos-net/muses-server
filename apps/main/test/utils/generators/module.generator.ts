/* eslint-disable hexagonal-architecture/enforce */
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { createModuleEntity } from '../factories/model.factory';
import { Repository } from 'typeorm';

export async function createModuleGenerator(repository: Repository<ModuleEntity>, params?: Partial<ModuleEntity>) {
  const entity = createModuleEntity(params);

  const moduleEntity = await repository.save(entity);

  return moduleEntity;
}
