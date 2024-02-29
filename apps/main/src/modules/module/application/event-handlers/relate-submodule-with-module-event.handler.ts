import { Injectable } from '@nestjs/common';
import { RelateSubModuleWithModuleEvent } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module.event';
import { AddSubModuleService } from '@module-module/application/use-cases/add-submodule/add-submodule.service';

@Injectable()
export class RelateSubModuleWithModuleEventHandler {
  constructor(private readonly addSubmoduleService: AddSubModuleService) {}

  public async handle(payload: RelateSubModuleWithModuleEvent): Promise<void> {
    const {
      body: { subModuleId, moduleId },
    } = payload;

    await this.addSubmoduleService.process({
      subModuleId,
      moduleId,
    });
  }
}
