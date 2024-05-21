import { RemoveDisabledSubModuleFromModuleEvent } from '@module-sub-module/domain/events/remove-disabled-sub-module-from-module-event/remove-disabled-sub-module-from-module.event';
import { RelateSubModuleWithModuleEvent } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module.event';
import { EventTopicEnum } from '@core/domain/contracts/event/event-topic-enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RemoveDisabledSubModuleFromModuleEventHandler } from '@module-module/application/event-handlers/remove-disabled-sub-module-from-module-event.handler';
import { RelateSubModuleWithModuleEventHandler } from '@module-module/application/event-handlers/relate-submodule-with-module-event.handler';
import { OverwriteSubModuleOnModuleEvent } from '@module-sub-module/domain/events/overwrite-sub-module-on-module-event/overwrite-sub-module-on-module.event';
import { OverwriteSubModuleOnModuleEventHandler } from '@module-module/application/event-handlers/overwrite-sub-module-on-module-event.handler';
import { UpdateRelationsWithModulesEvent } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules.event';
import { UpdateRelationsWithModulesEventHandler } from '@module-module/application/event-handlers/update-relations-with-modules-event.handler';
import { RelateActionWithModuleEvent } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module.event';
import { RelateActionWithModuleEventHandler } from '@module-module/application/event-handlers/relate-action-with-module-event.handler';
import { RemoveActionFromModulesEvent } from '@module-action/domain/events/remove-action-from-modules/remove-action-from-modules.event';
import { RemoveActionFromModulesEventHandler } from '@module-module/application/event-handlers/remove-action-from-modules-event.handler';

@Injectable()
export class ModuleListener {
  constructor(
    private readonly removeDisabledSubModuleFromModuleEventHandler: RemoveDisabledSubModuleFromModuleEventHandler,
    private readonly relateSubModuleWithModuleEventHandler: RelateSubModuleWithModuleEventHandler,
    private readonly overwriteSubModuleOnModuleEventHandler: OverwriteSubModuleOnModuleEventHandler,
    private readonly updateRelationsWithModulesEventHandler: UpdateRelationsWithModulesEventHandler,
    private readonly relateActionWithModuleEventHandler: RelateActionWithModuleEventHandler,
    private readonly removeActionFromModulesEventHandler: RemoveActionFromModulesEventHandler,
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

  @OnEvent(EventTopicEnum.ACTION_MGT + UpdateRelationsWithModulesEvent.name)
  public async handleUpdateRelationsWithModulesEvent(event: UpdateRelationsWithModulesEvent): Promise<void> {
    await this.updateRelationsWithModulesEventHandler.handle(event);
  }

  @OnEvent(EventTopicEnum.ACTION_MGT + RelateActionWithModuleEvent.name)
  public async handleRelateActionWithModuleEvent(event: RelateActionWithModuleEvent): Promise<void> {
    await this.relateActionWithModuleEventHandler.handle(event);
  }

  @OnEvent(EventTopicEnum.ACTION_MGT + RemoveActionFromModulesEvent.name)
  public async handleRemoveActionFromModulesEvent(event: RemoveActionFromModulesEvent): Promise<void> {
    await this.removeActionFromModulesEventHandler.handle(event);
  }
}
