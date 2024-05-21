import { IDomainEvent } from '@core/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { RelateModuleWithProjectEventBody } from '@module-module/domain/events/relate-module-with-project-event/relate-module-with-project-event-body';
import { v4 as uuid } from 'uuid';

export class RelateModuleWithProjectEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.MODULE_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: RelateModuleWithProjectEventBody;

  constructor(body: RelateModuleWithProjectEventBody) {
    this.body = body;
  }
}
