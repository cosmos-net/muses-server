import { Injectable } from '@nestjs/common';

@Injectable()
export class RelateSubModuleWithModuleEventHandler {
  constructor(private readonly addSubmoduleService: AddSubModuleService) {}

  public async handle(payload: RelateSubmoduleWithModuleEvent): Promise<void> {
    const {
      body: { subModuleId, moduleId },
    } = payload;

    await this.addSubmoduleService.process({
      subModuleId,
      moduleId,
    });
  }
}
