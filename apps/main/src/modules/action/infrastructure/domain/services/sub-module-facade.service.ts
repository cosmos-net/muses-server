import { SubModuleFacade } from '@module-sub-module/infrastructure/api-facade/sub-module.facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { ListSubModule } from '@module-sub-module/domain/aggregate/list-sub-module';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubModuleFacadeService implements ISubModuleFacade {
  constructor(private readonly subModuleFacade: SubModuleFacade) {}

  getSubModuleByIds(ids: string[]): Promise<ListSubModule> {
    return this.subModuleFacade.getSubModulesByIds({ ids });
  }
}
