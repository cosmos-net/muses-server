import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ACTION_CATALOG_REPOSITORY,
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { GetActionQuery } from '@module-action/application/use-cases/action/get-action/get-action.query';
import { Action } from '@module-action/domain/aggregate/action';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';

@Injectable()
export class GetActionService implements IApplicationServiceQuery<GetActionQuery> {
  constructor(
    @Inject(MODULE_FACADE)
    private readonly moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private readonly subModuleFacade: ISubModuleFacade,
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    @Inject(ACTION_CATALOG_REPOSITORY)
    private actionCatalogRepository: IActionCatalogRepository,
  ) {}

  async process<T extends GetActionQuery>(query: T): Promise<Action> {
    const { id, withDisabled } = query;

    const action = await this.actionRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (action === null) {
      throw new ActionNotFoundException();
    }

    if (action.modules && action.modules.length > 0) {
      const modules = await this.moduleFacade.getModuleByIds(action.modulesIds);
      action.useModules(modules.entities());
    }

    if (action.subModules && action.subModules.length > 0) {
      const subModules = await this.subModuleFacade.getSubModuleByIds(action.subModulesIds);
      action.useSubModules(subModules.entities());
    }

    const actionCatalogId = typeof action.actionCatalog === 'object' ? action.actionCatalog.id : action.actionCatalog;

    if (!actionCatalogId) {
      throw new InternalServerErrorException(`Action ${action.id} has no catalog`);
    }

      const actionCatalog = await this.actionCatalogRepository.oneBy(actionCatalogId);

      if (!actionCatalog) {
        throw new InternalServerErrorException(`Action ${action.id} has no catalog`);
      }

      action.categorize(actionCatalog);

    return action;
  }
}
