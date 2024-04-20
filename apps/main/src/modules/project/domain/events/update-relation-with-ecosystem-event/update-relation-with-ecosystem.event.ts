import { v4 as uuid } from 'uuid';
import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { UpdateRelationsWithEcosystemEventBody } from '@module-project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem-event-body';

export class UpdateRelationWithEcosystemEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.PROJECT_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: UpdateRelationsWithEcosystemEventBody;

  constructor(body: UpdateRelationsWithEcosystemEventBody) {
    this.body = body;
  }
}
