import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { v4 as uuid } from 'uuid';
import { RelateActionWithSubModuleEventBody } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module-event-body';

export class RelateActionWithSubModuleEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.ACTION_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: RelateActionWithSubModuleEventBody;

  constructor(body: RelateActionWithSubModuleEventBody) {
    this.body = body;
  }
}
