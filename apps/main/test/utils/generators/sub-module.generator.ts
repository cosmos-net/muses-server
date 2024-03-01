/* eslint-disable hexagonal-architecture/enforce */
import { SubModuleEntity } from '@app-main/modules/sub-module/infrastructure/domain/sub-module-muses.entity';
import { Repository } from 'typeorm';
import { createSubModuleEntity } from '@test-muses/utils/factories/sub-module.factory';

export async function createSubModuleGenerator(
  repository: Repository<SubModuleEntity>,
  params?: Partial<SubModuleEntity>,
) {
  const entity = createSubModuleEntity(params);

  const subModuleEntity = await repository.save(entity);

  return subModuleEntity;
}
