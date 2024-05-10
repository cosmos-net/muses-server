import { IModuleModuleFacadeService } from '@module-project/domain/contracts/module-module-facade';
import { Module } from '@module-module/domain/aggregate/module';
import { ModuleFacade } from '@module-module/infrastructure/api-facade/module-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleModuleFacadeService implements IModuleModuleFacadeService {
  constructor(private readonly moduleModulesFacade: ModuleFacade) {}

  async getModuleById(id: string): Promise<Module> {
    const module = await this.moduleModulesFacade.retrieveModule({
      id,
      withDisabled: true,
      withProject: false,
    });

    return module;
  }
}
