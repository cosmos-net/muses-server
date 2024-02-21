import { RelateModuleWithProjectEvent } from '@module-module/domain/events/relate-module-with-project-event/relate-module-with-project.event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RelateModuleWithProjectEventHandler } from '@app-main/modules/project/application/event-handlers/relate-module-with-project-event.handler';

@Injectable()
export class ProjectListener {
  constructor(private readonly relateModuleWithProjectEventHandler: RelateModuleWithProjectEventHandler) {}

  @OnEvent(EventTopicEnum.MODULE_MGT + RelateModuleWithProjectEvent.name)
  public async handleRelateModuleWithProjectEvent(event: RelateModuleWithProjectEvent): Promise<void> {
    await this.relateModuleWithProjectEventHandler.handle(event);
  }
}
