import { ListModule } from '@module-module/domain/list-module';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ModuleFacade } from '@module-module/infrastructure/api-facade/module-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleFacadeService implements IModuleFacade {
  constructor(private readonly moduleFacade: ModuleFacade) {}

  getModuleByIds(ids: string[]): Promise<ListModule> {
    return this.moduleFacade.getModulesByIds({ ids });
  }
}
