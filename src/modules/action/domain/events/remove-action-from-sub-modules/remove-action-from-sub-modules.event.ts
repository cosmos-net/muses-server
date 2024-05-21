import { IDomainEvent } from '@core/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { RemoveActionFromSubModulesEventBody } from '@module-action/domain/events/remove-action-from-sub-modules/remove-action-from-sub-modules-event.body';
import { v4 as uuid } from 'uuid';

export class RemoveActionFromSubModulesEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.ACTION_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: RemoveActionFromSubModulesEventBody;

  constructor(body: RemoveActionFromSubModulesEventBody) {
    this.body = body;
  }
}
