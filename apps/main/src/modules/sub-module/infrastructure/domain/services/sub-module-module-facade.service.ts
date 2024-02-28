import { ISubModuleModuleFacade } from '@app-main/modules/sub-module/domain/contracts/module-sub-module-facade';
import { ModuleModuleFacade } from '@module-module/infrastructure/api-facade/module-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubModuleModuleFacadeService implements ISubModuleModuleFacade {
  constructor(private readonly subModuleModuleFacade: ModuleModuleFacade) {}

  async getModuleById(id: string) {
    const module = await this.subModuleModuleFacade.retrieveModule({ id, withDisabled: true });

    return module;
  }
}
