import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { ListActionQuery } from '@module-action/application/use-cases/action/list-actions/list-action.query';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ACTION_CATALOG_REPOSITORY,
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { ListAction } from '@module-action/domain/aggregate/list-action';
import { Filters } from '@core/domain/criteria/filters';
import { Order } from '@core/domain/criteria/order';
import { Criteria } from '@core/domain/criteria/criteria';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';

@Injectable()
export class ListActionService implements IApplicationServiceQuery<ListActionQuery> {
  constructor(
    @Inject(MODULE_FACADE)
    private readonly moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private readonly subModuleFacade: ISubModuleFacade,
    @Inject(ACTION_REPOSITORY)
    private readonly actionRepository: IActionRepository,
    @Inject(ACTION_CATALOG_REPOSITORY)
    private readonly actionCatalogRepository: IActionCatalogRepository,
  ) {}

  async process<T extends ListActionQuery>(query: T): Promise<ListAction> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const actions = await this.actionRepository.searchListBy(criteria);

    for await (const action of actions.items) {
      const modulesId = action.moduleId
      const subModulesIds = action.submoduleId;

      const modules = await this.moduleFacade.getModuleByIds([modulesId]);
      action.useModule(modules.entities()[0]);

      if (subModulesIds) {
        const subModules = await this.subModuleFacade.getSubModuleByIds([subModulesIds]);
        action.useSubmodule(subModules.entities()[0]);
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
    }

    return actions;
  }
}
