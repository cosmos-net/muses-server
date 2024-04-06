/* eslint-disable hexagonal-architecture/enforce */
import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

export function createResourceEntity(params?: Partial<ResourceEntity>): ResourceEntity {
  let resourceEntity = new ResourceEntity();

  const defaultResourceEntity = {
    name: faker.string.alpha(10),
    description: faker.string.alpha(10),
    isEnabled: true,
    endpoint: faker.internet.url(),
    method: EnumMethodValue.GET,
    actions: [new ObjectId()],
  };

  resourceEntity = {
    ...resourceEntity,
    ...defaultResourceEntity,
    ...params,
  };

  return resourceEntity;
}
