import { UpdateRelationsWithModulesEvent } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules.event';
import { Injectable } from '@nestjs/common';
import { ExchangeActionModulesService } from '@module-module/application/use-cases/exchange-action-modules/exchange-action-modules.service';

@Injectable()
export class UpdateRelationsWithModulesEventHandler {
  constructor(private readonly exchangeActionModulesService: ExchangeActionModulesService) {}

  public async handle(payload: UpdateRelationsWithModulesEvent): Promise<void> {
    const {
      body: { actionId, legacyModules, newModules },
    } = payload;

    await this.exchangeActionModulesService.process({
      actionId,
      legacyModules,
      newModules,
    });
  }
}
