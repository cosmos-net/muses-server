import { IDomainEvent } from '@core/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { RemoveActionFromModulesEventBody } from '@module-action/domain/events/remove-action-from-modules/remove-action-from-modules-event.body';
import { v4 as uuid } from 'uuid';

export class RemoveActionFromModulesEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.ACTION_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: RemoveActionFromModulesEventBody;

  constructor(body: RemoveActionFromModulesEventBody) {
    this.body = body;
  }
}
