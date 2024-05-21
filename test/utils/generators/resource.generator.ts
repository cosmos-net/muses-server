/* eslint-disable hexagonal-architecture/enforce */
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { Repository } from 'typeorm';
import { createResourceEntity } from '../factories/resource.factory';

export async function createResourceGenerator(
  repository: Repository<ResourceEntity>,
  params?: Partial<ResourceEntity>,
) {
  const entity = createResourceEntity(params);

  const resourceEntity = await repository.save(entity);

  return resourceEntity;
}
