import { IDomainEvent } from '@core/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { v4 as uuid } from 'uuid';
import { RelateActionWithModuleEventBody } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module-event-body';

export class RelateActionWithModuleEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.ACTION_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: RelateActionWithModuleEventBody;

  constructor(body: RelateActionWithModuleEventBody) {
    this.body = body;
  }
}
