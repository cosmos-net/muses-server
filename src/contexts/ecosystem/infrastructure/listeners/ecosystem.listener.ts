import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateRelationWithEcosystemEvent } from '@module-project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem.event';
import { UpdateRelationsWithProjectEventHandler } from '@context-ecosystem/application/event-handlers/update-relations-with-resource-event.handler';

@Injectable()
export class EcosystemListener {
  constructor(private readonly updateRelationsWithProjectEventHandler: UpdateRelationsWithProjectEventHandler) {}

  @OnEvent(EventTopicEnum.PROJECT_MGT + UpdateRelationWithEcosystemEvent.name)
  public async handleRemoveActionFromModulesEvent(event: UpdateRelationWithEcosystemEvent): Promise<void> {
    await this.updateRelationsWithProjectEventHandler.handle(event);
  }
}
