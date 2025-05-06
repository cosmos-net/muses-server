import { RemoveActionFromModulesEvent } from '@module-action/domain/events/remove-action-from-modules/remove-action-from-modules.event';
import { Injectable } from '@nestjs/common';
import { RemoveActionService } from '@module-module/application/use-cases/remove-action/remove-action.service';

@Injectable()
export class RemoveActionFromModulesEventHandler {
  constructor(private readonly removeActionService: RemoveActionService) {}

  public async handle(payload: RemoveActionFromModulesEvent): Promise<void> {
    const {
      body: { actionId, modules },
    } = payload;

    await this.removeActionService.process({
      actionId,
      modules,
    });
  }
}
