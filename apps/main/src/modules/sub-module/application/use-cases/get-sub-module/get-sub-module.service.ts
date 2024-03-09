import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { Inject, Injectable } from '@nestjs/common';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { GetSubModuleQuery } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.query';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { SubModuleNotFoundException } from '@module-sub-module/domain/exceptions/sub-module-not-found.exception';
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
    const { id, withDisabled } = query;

    const subModule = await this.subModuleRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (subModule === null) {
      throw new SubModuleNotFoundException();
    }

    const moduleModel = await this.moduleFacade.getModuleById(subModule.moduleId);

    if (!moduleModel.isEnabled) {
      // TODO: create a exception
      throw new Error('Module is disabled');
    }

    subModule.useModule({
      id: moduleModel.id,
      name: moduleModel.name,
      description: moduleModel.description,
      project: moduleModel.project,
      isEnabled: moduleModel.isEnabled,
      createdAt: moduleModel.createdAt,
      updatedAt: moduleModel.updatedAt,
      deletedAt: moduleModel.deletedAt,
      subModules: moduleModel.subModules,
    });

    return subModule;
  }
}
