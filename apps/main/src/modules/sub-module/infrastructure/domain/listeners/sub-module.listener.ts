import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateRelationsWithSubModulesEvent } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules.event';
import { UpdateRelationsWithSubModulesEventHandler } from '@module-sub-module/application/event-handlers/update-relations-with-sub-modules-event.handler';
import { RelateActionWithSubModuleEvent } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module.event';
import { RelateActionWithSubModuleEventHandler } from '@module-sub-module/application/event-handlers/relate-action-with-sub-module-event.handler';

@Injectable()
export class SubModuleListener {
  constructor(
    private readonly updateRelationsWithSubModulesEventHandler: UpdateRelationsWithSubModulesEventHandler,
    private readonly relateActionWithSubModuleEventHandler: RelateActionWithSubModuleEventHandler,
  ) {}

  @OnEvent(EventTopicEnum.ACTION_MGT + UpdateRelationsWithSubModulesEvent.name)
  public async handleUpdateRelationsWithSubModulesEvent(event: UpdateRelationsWithSubModulesEvent): Promise<void> {
    await this.updateRelationsWithSubModulesEventHandler.handle(event);
  }

  @OnEvent(EventTopicEnum.ACTION_MGT + RelateActionWithSubModuleEvent.name)
  public async handleRelateActionWithSubModuleEvent(event: RelateActionWithSubModuleEvent): Promise<void> {
    await this.relateActionWithSubModuleEventHandler.handle(event);
  }
}
