import { Injectable } from '@nestjs/common';
import { ISubModuleModuleFacade } from '@module-module/domain/contracts/sub-module-facade';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { SubModuleFacade } from '@module-sub-module/infrastructure/api-facade/sub-module.facade';

@Injectable()
export class SubModuleFacadeService implements ISubModuleModuleFacade {
  constructor(private readonly moduleModulesFacade: SubModuleFacade) {}

  async getSubModuleBy(id: string): Promise<SubModule> {
    const subModule = await this.moduleModulesFacade.retrieveSubModule({
      id,
      withDisabled: true,
      withModules: false,
    });

    return subModule;
  }
}
