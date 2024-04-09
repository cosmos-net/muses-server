import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateRelationWithActionEvent } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action.event';
import { UpdateRelationsWithResourceEventHandler } from '@app-main/modules/action/application/event-handlers/update-relations-with-resource-event.handler';

@Injectable()
export class ActionListener {
  constructor(private readonly updateRelationsWithResourceEventHandler: UpdateRelationsWithResourceEventHandler) {}

  @OnEvent(EventTopicEnum.RESOURCE_MGT + UpdateRelationWithActionEvent.name)
  public async handleRemoveActionFromModulesEvent(event: UpdateRelationWithActionEvent): Promise<void> {
    await this.updateRelationsWithResourceEventHandler.handle(event);
  }
}
