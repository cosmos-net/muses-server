import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';

export interface IEventStore {
  emit<T extends IDomainEvent>(data: T): Promise<void>;
}
