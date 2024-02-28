import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { v4 as uuid } from 'uuid';
import { RelateSubModuleWithModuleEventBody } from './relate-sub-module-with-module-event-body';

export class RelateSubModuleWithModuleEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.MODULE_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: RelateSubModuleWithModuleEventBody;

  constructor(body: RelateSubModuleWithModuleEventBody) {
    this.body = body;
  }
}
