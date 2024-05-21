import { RemoveDisabledSubModuleFromModuleEvent } from '@module-sub-module/domain/events/remove-disabled-sub-module-from-module-event/remove-disabled-sub-module-from-module.event';
import { RemoveSubModuleService } from '@module-module/application/use-cases/remove-sub-modules/remove-sub-modules.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveDisabledSubModuleFromModuleEventHandler {
  constructor(private readonly removeSubModuleService: RemoveSubModuleService) {}

  public async handle(payload: RemoveDisabledSubModuleFromModuleEvent): Promise<void> {
    const {
      body: { subModuleId, moduleId },
    } = payload;

    await this.removeSubModuleService.process({
      subModuleId,
      moduleId,
    });
  }
}
