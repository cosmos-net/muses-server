import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { ListSubModuleQuery } from '@module-sub-module/application/use-cases/list-sub-module/list-sub-module.query';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { ListSubModule } from '@module-sub-module/domain/aggregate/list-sub-module';
import { Filters } from '@lib-commons/domain/criteria/filters';
import { Order } from '@lib-commons/domain/criteria/order';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { IModuleFacade } from '@module-sub-module/domain/contracts/module-sub-module-facade';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

@Injectable()
export class ListSubModuleService implements IApplicationServiceQuery<ListSubModuleQuery> {
  constructor(
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
  ) {}

  async process<T extends ListSubModuleQuery>(query: T): Promise<ListSubModule> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const subModules = await this.subModuleRepository.searchListBy(criteria);

    const populatedSubModules: SubModule[] = [];

    // TODO: Mejorar esta shiet con una mejor definición de semantica
    for (const subModule of subModules.items) {
      const moduleModel = await this.moduleFacade.getModuleById(subModule.moduleId);

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
        actions: moduleModel.actions,
      });

      populatedSubModules.push(subModule);
    }

    subModules.items = populatedSubModules;

    return subModules;
  }
}
