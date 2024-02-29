import { IModuleFacade } from '@app-main/modules/sub-module/domain/contracts/module-sub-module-facade';
import { ModuleFacade } from '@module-module/infrastructure/api-facade/module-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleFacadeService implements IModuleFacade {
  constructor(private readonly moduleFacade: ModuleFacade) {}

  async getModuleById(id: string) {
    const module = await this.moduleFacade.retrieveModule({ id, withDisabled: true });

    return module;
  }
}
