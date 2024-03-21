import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateRelationsWithSubModulesEvent } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules.event';
import { UpdateRelationsWithSubModulesEventHandler } from '@module-sub-module/application/event-handlers/update-relations-with-sub-modules-event.handler';

@Injectable()
export class SubModuleListener {
  constructor(private readonly updateRelationsWithSubModulesEventHandler: UpdateRelationsWithSubModulesEventHandler) {}

  @OnEvent(EventTopicEnum.ACTION_MGT + UpdateRelationsWithSubModulesEvent.name)
  public async handleUpdateRelationsWithSubModulesEvent(event: UpdateRelationsWithSubModulesEvent): Promise<void> {
    await this.updateRelationsWithSubModulesEventHandler.handle(event);
  }
}
