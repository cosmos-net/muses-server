import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { UpdateRelationsWithSubModulesEventBody } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules-event.body';
import { v4 as uuid } from 'uuid';

export class UpdateRelationsWithSubModulesEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.ACTION_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: UpdateRelationsWithSubModulesEventBody;

  constructor(body: UpdateRelationsWithSubModulesEventBody) {
    this.body = body;
  }
}
