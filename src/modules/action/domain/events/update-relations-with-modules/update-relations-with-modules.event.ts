import { IDomainEvent } from '@core/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { UpdateRelationsWithModulesEventBody } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules-event.body';
import { v4 as uuid } from 'uuid';

export class UpdateRelationsWithModulesEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.ACTION_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: UpdateRelationsWithModulesEventBody;

  constructor(body: UpdateRelationsWithModulesEventBody) {
    this.body = body;
  }
}
