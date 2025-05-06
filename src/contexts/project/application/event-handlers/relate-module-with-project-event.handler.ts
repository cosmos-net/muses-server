import { Injectable } from '@nestjs/common';
import { AddModuleService } from '@module-project/application/use-cases/add-module/add-module.service';
import { RelateModuleWithProjectEvent } from '@module-module/domain/events/relate-module-with-project-event/relate-module-with-project.event';

@Injectable()
export class RelateModuleWithProjectEventHandler {
  constructor(private readonly addModuleService: AddModuleService) {}

  public async handle(payload: RelateModuleWithProjectEvent): Promise<void> {
    const {
      body: { projectId, moduleId },
    } = payload;

    await this.addModuleService.process({
      moduleId,
      projectId,
    });
  }
}
