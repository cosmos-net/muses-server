import { Injectable } from '@nestjs/common';
import { RelateActionWithSubModuleEvent } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module.event';
import { AddActionService } from '@module-sub-module/application/use-cases/add-action/add-action.service';

@Injectable()
export class RelateActionWithSubModuleEventHandler {
  constructor(private readonly addActionService: AddActionService) {}

  public async handle(payload: RelateActionWithSubModuleEvent): Promise<void> {
    const {
      body: { actionId, subModules },
    } = payload;

    await this.addActionService.process({
      actionId,
      subModules,
    });
  }
}
