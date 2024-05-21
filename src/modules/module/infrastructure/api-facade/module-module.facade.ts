import { Injectable } from '@nestjs/common';
import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { GetModuleQuery } from '@module-module/application/use-cases/get-module/get-module.query';
import { Module } from '@module-module/domain/aggregate/module';
import { GetModulesByIdsService } from '@module-module/application/use-cases/get-modules-by-ids/get-modules-by-ids.service';
import { GetModulesByIdsQuery } from '@module-module/application/use-cases/get-modules-by-ids/get-modules-by-ids.query';
import { ListModule } from '@module-module/domain/list-module';

@Injectable()
export class ModuleFacade {
  constructor(
    private readonly getModuleService: GetModuleService,
    private readonly getModulesByIdService: GetModulesByIdsService,
  ) {}

  public async retrieveModule(retrieveModuleQuery: GetModuleQuery): Promise<Module> {
    return this.getModuleService.process(retrieveModuleQuery);
  }

  public async getModulesByIds(getModulesByIdsQuery: GetModulesByIdsQuery): Promise<ListModule> {
    return this.getModulesByIdService.process(getModulesByIdsQuery);
  }
}
