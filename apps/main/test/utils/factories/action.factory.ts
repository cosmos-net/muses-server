/* eslint-disable hexagonal-architecture/enforce */
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { faker } from '@faker-js/faker';

export function createActionEntity(params?: Partial<ActionEntity>): ActionEntity {
  let actionEntity = new ActionEntity();

  const defaultActionEntity = {
    name: faker.string.alpha(10),
    description: faker.string.alpha(10),
    isEnabled: true,
    modules: [],
    subModules: [],
  };

  actionEntity = {
    ...actionEntity,
    ...defaultActionEntity,
    ...params,
  };

  return actionEntity;
}
