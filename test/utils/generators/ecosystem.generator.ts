/* eslint-disable hexagonal-architecture/enforce */
import { EcosystemEntity } from '@context-ecosystem/infrastructure/domain/ecosystem-muses.entity';
import { Repository } from 'typeorm';
import { createEcosystemEntity } from '@test/utils/factories/ecosystem.factory';

export async function createEcosystemGenerator(
  repository: Repository<EcosystemEntity>,
  params?: Partial<EcosystemEntity>,
) {
  const entity = createEcosystemEntity(params);

  const ecosystemEntity = await repository.save(entity);

  return ecosystemEntity;
}
