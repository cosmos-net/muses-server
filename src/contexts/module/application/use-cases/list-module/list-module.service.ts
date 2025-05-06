import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { ListModuleQuery } from '@module-module/application/use-cases/list-module/list-module.query';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { ListModule } from '@module-module/domain/list-module';
import { Filters } from '@core/domain/criteria/filters';
import { Order } from '@core/domain/criteria/order';
import { Criteria } from '@core/domain/criteria/criteria';
import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';

@Injectable()
export class ListModuleService implements IApplicationServiceQuery<ListModuleQuery> {
  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
    @Inject(PROJECT_MODULE_FACADE)
    private projectModuleFacade: IProjectModuleFacade,
  ) {}

  async process<T extends ListModuleQuery>(query: T): Promise<ListModule> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const modules = await this.moduleRepository.searchListBy(criteria);

    for await (const module of modules.entities()) {
      const project = await this.projectModuleFacade.getProjectById(module.projectId);
      module.useProject(project);
    }

    return modules;
  }
}
