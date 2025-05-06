import { RemoveActionFromSubModulesEvent } from '@module-action/domain/events/remove-action-from-sub-modules/remove-action-from-sub-modules.event';
import { Injectable } from '@nestjs/common';
import { RemoveActionService } from '@module-sub-module/application/use-cases/remove-action/remove-action.service';

@Injectable()
export class RemoveActionFromSubModulesEventHandler {
  constructor(private readonly removeActionService: RemoveActionService) {}

  public async handle(payload: RemoveActionFromSubModulesEvent): Promise<void> {
    const {
      body: { actionId, subModules },
    } = payload;

    await this.removeActionService.process({
      actionId,
      subModules,
    });
  }
}
