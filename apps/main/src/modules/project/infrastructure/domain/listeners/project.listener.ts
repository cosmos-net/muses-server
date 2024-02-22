import { RelateModuleWithProjectEvent } from '@module-module/domain/events/relate-module-with-project-event/relate-module-with-project.event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RelateModuleWithProjectEventHandler } from '@module-project/application/event-handlers/relate-module-with-project-event.handler';
import { OverwriteModuleOnProjectEvent } from '@module-module/domain/events/overwrite-module-on-project-event/overwrite-module-on-project.event';
import { OverwriteModuleOnProjectEventHandler } from '@module-project/application/event-handlers/overwrite-module-on-project-event.handler';

@Injectable()
export class ProjectListener {
  constructor(
    private readonly relateModuleWithProjectEventHandler: RelateModuleWithProjectEventHandler,
    private readonly overwriteModuleOnProjectEventHandler: OverwriteModuleOnProjectEventHandler,
  ) {}

  @OnEvent(EventTopicEnum.MODULE_MGT + RelateModuleWithProjectEvent.name)
  public async handleRelateModuleWithProjectEvent(event: RelateModuleWithProjectEvent): Promise<void> {
    await this.relateModuleWithProjectEventHandler.handle(event);
  }

  @OnEvent(EventTopicEnum.MODULE_MGT + OverwriteModuleOnProjectEvent.name)
  public async handleOverwriteModuleOnProjectEvent(event: OverwriteModuleOnProjectEvent): Promise<void> {
    await this.overwriteModuleOnProjectEventHandler.handle(event);
  }
}
