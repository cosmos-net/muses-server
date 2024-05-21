/* eslint-disable hexagonal-architecture/enforce */
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

export function createModuleEntity(params?: Partial<ModuleEntity>): ModuleEntity {
  const moduleEntity = new ModuleEntity();

  const defaultModelEntity = {
    name: faker.string.alpha(10),
    description: faker.string.alpha(10),
    isEnabled: true,
    project: new ObjectId(),
  };

  return {
    ...moduleEntity,
    ...defaultModelEntity,
    ...params,
  };
}
