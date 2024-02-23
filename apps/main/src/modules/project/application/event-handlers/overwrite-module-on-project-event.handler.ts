import { Injectable } from '@nestjs/common';
import { ExchangeModuleProjectsService } from '@module-project/application/use-cases/exchange-module-projects/exchange-module-projects.service';
import { OverwriteModuleOnProjectEvent } from '@module-module/domain/events/overwrite-module-on-project-event/overwrite-module-on-project.event';

@Injectable()
export class OverwriteModuleOnProjectEventHandler {
  constructor(private readonly exchangeModuleProjectsService: ExchangeModuleProjectsService) {}

  public async handle(payload: OverwriteModuleOnProjectEvent): Promise<void> {
    const {
      body: { moduleId, previousProjectId, newProjectId },
    } = payload;

    await this.exchangeModuleProjectsService.process({
      moduleId,
      previousProjectId,
      newProjectId,
    });
  }
}
