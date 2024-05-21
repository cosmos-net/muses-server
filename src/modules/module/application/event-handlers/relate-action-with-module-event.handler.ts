import { Injectable } from '@nestjs/common';
import { RelateActionWithModuleEvent } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module.event';
import { AddActionService } from '@module-module/application/use-cases/add-action/add-action.service';

@Injectable()
export class RelateActionWithModuleEventHandler {
  constructor(private readonly addActionService: AddActionService) {}

  public async handle(payload: RelateActionWithModuleEvent): Promise<void> {
    const {
      body: { actionId, modules },
    } = payload;

    await this.addActionService.process({
      actionId,
      modules,
    });
  }
}
