import { UpdateRelationsWithSubModulesEvent } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules.event';
import { Injectable } from '@nestjs/common';
import { ExchangeActionSubModulesService } from '@module-sub-module/application/use-cases/exchange-action-sub-modules/exchange-action-sub-modules.service';

@Injectable()
export class UpdateRelationsWithSubModulesEventHandler {
  constructor(private readonly exchangeActionSubModulesService: ExchangeActionSubModulesService) {}

  public async handle(payload: UpdateRelationsWithSubModulesEvent): Promise<void> {
    const {
      body: { actionId, legacySubModules, newSubModules },
    } = payload;

    await this.exchangeActionSubModulesService.process({
      actionId,
      legacySubModules,
      newSubModules,
    });
  }
}
