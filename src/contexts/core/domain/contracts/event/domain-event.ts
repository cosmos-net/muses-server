import { IEventBody } from '@core/domain/contracts/event/event-body';

export interface IDomainEvent {
  id: string;
  version: number;
  type: string;
  correlationId: string | null;
  causationId: string | null;
  body: IEventBody;
}
