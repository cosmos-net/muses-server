import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { ListSubModuleQuery } from '@module-sub-module/application/use-cases/list-sub-module/list-sub-module.query';
import { SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { ListSubModule } from '@module-sub-module/domain/list-sub-module';
import { Filters } from '@lib-commons/domain/criteria/filters';
import { Order } from '@lib-commons/domain/criteria/order';
import { Criteria } from '@lib-commons/domain/criteria/criteria';

@Injectable()
export class ListSubModuleService implements IApplicationServiceQuery<ListSubModuleQuery> {
  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
  ) {}

  async process<T extends ListSubModuleQuery>(query: T): Promise<ListSubModule> {
    const { limit, offset } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset);

    const modules = await this.subModuleRepository.searchListBy(criteria);

    return modules;
  }
}
