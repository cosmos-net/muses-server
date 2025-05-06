import { IDomainEvent } from '@core/domain/contracts/event/domain-event';

export interface IEventStore {
  emit<T extends IDomainEvent>(data: T): Promise<any[]>;
}
