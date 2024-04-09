import { v4 as uuid } from 'uuid';
import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { UpdateRelationsWithActionEventBody } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action-event-body';

export class UpdateRelationWithActionEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.RESOURCE_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: UpdateRelationsWithActionEventBody;

  constructor(body: UpdateRelationsWithActionEventBody) {
    this.body = body;
  }
}
