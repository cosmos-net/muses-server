import { IDomainEvent } from '@lib-commons/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { OverwriteModuleOnProjectEventBody } from '@module-module/domain/events/overwrite-module-on-project-event/overwrite-module-on-project-event-body';
import { v4 as uuid } from 'uuid';

export class OverwriteModuleOnProjectEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.MODULE_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: OverwriteModuleOnProjectEventBody;

  constructor(body: OverwriteModuleOnProjectEventBody) {
    this.body = body;
  }
}
