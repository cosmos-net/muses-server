/* eslint-disable hexagonal-architecture/enforce */
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { Repository } from 'typeorm';
import { createActionEntity } from '@test/utils/factories/action.factory';

export async function createActionGenerator(repository: Repository<ActionEntity>, params?: Partial<ActionEntity>) {
  const entity = createActionEntity(params);

  const actionEntity = await repository.save(entity);

  return actionEntity;
}
