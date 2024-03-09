import { Injectable } from '@nestjs/common';
import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { GetModuleQuery } from '@module-module/application/use-cases/get-module/get-module.query';
import { Module } from '@module-module/domain/aggregate/module';

@Injectable()
export class ModuleFacade {
  constructor(private readonly getModuleService: GetModuleService) {}

  public async retrieveModule(retrieveModuleQuery: GetModuleQuery): Promise<Module> {
    return this.getModuleService.process(retrieveModuleQuery);
  }
}
