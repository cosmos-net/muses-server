import { IDomainEvent } from '@core/domain/contracts/event/domain-event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { v4 as uuid } from 'uuid';
import { OverwriteSubModuleOnModuleEventBody } from '@module-sub-module/domain/events/overwrite-sub-module-on-module-event/overwrite-sub-module-on-module-event-body';

export class OverwriteSubModuleOnModuleEvent implements IDomainEvent {
  readonly id: string = uuid();

  readonly version: number = 1;

  readonly type: string = EventTopicEnum.SUB_MODULE_MGT + this.constructor.name;

  readonly correlationId: string | null;

  readonly causationId: string | null;

  readonly createdAt: Date = new Date();

  readonly body: OverwriteSubModuleOnModuleEventBody;

  constructor(body: OverwriteSubModuleOnModuleEventBody) {
    this.body = body;
  }
}
