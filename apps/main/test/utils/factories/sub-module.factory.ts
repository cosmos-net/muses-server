/* eslint-disable hexagonal-architecture/enforce */
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';

export function createSubModuleEntity(params?: Partial<SubModuleEntity>): SubModuleEntity {
  let subModuleEntity = new SubModuleEntity();

  const defaultSubModuleEntity = {
    name: faker.string.alpha(10),
    description: faker.string.alpha(10),
    isEnabled: true,
    module: new ObjectId(),
  };

  subModuleEntity = {
    ...subModuleEntity,
    ...defaultSubModuleEntity,
    ...params,
  };

  return subModuleEntity;
}
