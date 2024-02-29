import { RemoveDisabledSubModuleFromModuleEvent } from '@module-sub-module/domain/events/remove-disabled-sub-module-from-module-event/remove-disabled-sub-module-from-module.event';
import { RelateSubModuleWithModuleEvent } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module.event';
import { EventTopicEnum } from '@lib-commons/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RemoveDisabledSubModuleFromModuleEventHandler } from '@module-module/application/event-handlers/remove-disabled-sub-module-from-module-event.handler';
import { RelateSubModuleWithModuleEventHandler } from '@module-module/application/event-handlers/relate-submodule-with-module-event.handler';
import { OverwriteSubModuleOnModuleEvent } from '@module-sub-module/domain/events/overwrite-sub-module-on-module-event/overwrite-sub-module-on-module.event';
import { OverwriteSubModuleOnModuleEventHandler } from '@module-module/application/event-handlers/overwrite-sub-module-on-module-event.handler';

@Injectable()
export class ModuleListener {
  constructor(
    private readonly removeDisabledSubModuleFromModuleEventHandler: RemoveDisabledSubModuleFromModuleEventHandler,
    private readonly relateSubModuleWithModuleEventHandler: RelateSubModuleWithModuleEventHandler,
    private readonly overwriteSubModuleOnModuleEventHandler: OverwriteSubModuleOnModuleEventHandler,
  ) {}

  @OnEvent(EventTopicEnum.SUB_MODULE_MGT + RelateSubModuleWithModuleEvent.name)
  public async handleRelateSubModuleWithModuleEvent(event: RelateSubModuleWithModuleEvent): Promise<void> {
    await this.relateSubModuleWithModuleEventHandler.handle(event);
  }

  @OnEvent(EventTopicEnum.SUB_MODULE_MGT + RemoveDisabledSubModuleFromModuleEvent.name)
  public async handleRemoveDisabledSubModuleFromModuleEvent(
    event: RemoveDisabledSubModuleFromModuleEvent,
  ): Promise<void> {
    await this.removeDisabledSubModuleFromModuleEventHandler.handle(event);
  }

  @OnEvent(EventTopicEnum.SUB_MODULE_MGT + OverwriteSubModuleOnModuleEvent.name)
  public async handleOverwriteSubModuleOnModuleEvent(event: OverwriteSubModuleOnModuleEvent): Promise<void> {
    await this.overwriteSubModuleOnModuleEventHandler.handle(event);
  }
}
