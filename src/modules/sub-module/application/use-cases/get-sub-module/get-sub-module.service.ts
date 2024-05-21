import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { Inject, Injectable } from '@nestjs/common';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { GetSubModuleQuery } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.query';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { SubModuleNotFoundException } from '@module-common/domain/exceptions/sub-module-not-found.exception';
import { IModuleFacade } from '@module-sub-module/domain/contracts/module-sub-module-facade';

@Injectable()
export class GetSubModuleService implements IApplicationServiceQuery<GetSubModuleQuery> {
  constructor(
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
  ) {}

  async process<T extends GetSubModuleQuery>(query: T): Promise<SubModule> {
    const { id, withDisabled, withModules } = query;

    const subModule = await this.subModuleRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (subModule === null) {
      throw new SubModuleNotFoundException();
    }

    if (withModules === true) {
      const moduleModel = await this.moduleFacade.getModuleById(subModule.moduleId);
      subModule.useModule(moduleModel);
    }

    return subModule;
  }
}
