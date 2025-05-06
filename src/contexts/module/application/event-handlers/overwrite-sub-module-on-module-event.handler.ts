import { Injectable } from '@nestjs/common';
import { OverwriteSubModuleOnModuleEvent } from '@module-sub-module/domain/events/overwrite-sub-module-on-module-event/overwrite-sub-module-on-module.event';
import { ExchangeSubModuleModuleService } from '@module-module/application/use-cases/exchange-sub-module-module/exchange-sub-module-module.service';

@Injectable()
export class OverwriteSubModuleOnModuleEventHandler {
  constructor(private readonly exchangeSubmoduleModulesService: ExchangeSubModuleModuleService) {}
  public async handle(payload: OverwriteSubModuleOnModuleEvent): Promise<void> {
    const {
      body: { subModuleId, previousModuleId, newModuleId },
    } = payload;

    await this.exchangeSubmoduleModulesService.process({
      subModuleId,
      previousModuleId,
      newModuleId,
    });
  }
}
