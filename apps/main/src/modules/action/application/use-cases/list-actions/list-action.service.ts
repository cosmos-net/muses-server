import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { ListActionQuery } from '@module-action/application/use-cases/list-actions/list-action.query';
import { Inject, Injectable } from '@nestjs/common';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { ListAction } from '@module-action/domain/aggregate/list-action';
import { Filters } from '@lib-commons/domain/criteria/filters';
import { Order } from '@lib-commons/domain/criteria/order';
import { Criteria } from '@lib-commons/domain/criteria/criteria';

@Injectable()
export class ListActionService implements IApplicationServiceQuery<ListActionQuery> {
  constructor(
    @Inject(MODULE_FACADE)
    private readonly moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private readonly subModuleFacade: ISubModuleFacade,
    @Inject(ACTION_REPOSITORY)
    private readonly actionRepository: IActionRepository,
  ) {}

  async process<T extends ListActionQuery>(query: T): Promise<ListAction> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const actions = await this.actionRepository.searchListBy(criteria);

    for await (const action of actions.items) {
      const modulesIds = action.modulesIds;
      const subModulesIds = action.subModulesIds;

      const modules = await this.moduleFacade.getModuleByIds(modulesIds);
      action.useModules(modules.entities());

      const subModules = await this.subModuleFacade.getSubModuleByIds(subModulesIds);
      action.useSubModules(subModules.entities());
    }

    return actions;
  }
}
