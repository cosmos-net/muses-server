/* eslint-disable hexagonal-architecture/enforce */
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { EcosystemEntity } from '@context-ecosystem/infrastructure/domain/ecosystem-muses.entity';

export function createEcosystemEntity(params?: Partial<EcosystemEntity>): EcosystemEntity {
  const id = new ObjectId();
  
  const entity = new EcosystemEntity();
  entity._id = params?._id ?? id;
  entity.id = params?.id ?? id.toHexString();
  entity.name = params?.name ?? faker.string.alpha(10);
  entity.description = params?.description ?? faker.string.alpha(10);
  entity.isEnabled = params?.isEnabled ?? true;
  entity.projects = params?.projects ?? [];
  entity.createdAt = params?.createdAt ?? new Date();
  entity.updatedAt = params?.updatedAt ?? new Date();

  return entity;
}
