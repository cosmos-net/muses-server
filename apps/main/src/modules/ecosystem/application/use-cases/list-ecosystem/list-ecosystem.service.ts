import { Inject, Injectable, Logger } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY, ListEcosystemQuery } from '@module-eco/application/';
import { IApplicationServiceQuery } from '@lib-commons/application';
import { ListEcosystem } from '@module-eco/domain';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';
import { Filters } from '@lib-commons/domain/criteria/filters';
import { Order } from '@lib-commons/domain/criteria/order';
import { Criteria } from '@lib-commons/domain/criteria/criteria';

@Injectable()
export class ListEcosystemService implements IApplicationServiceQuery<ListEcosystemQuery> {
  private logger = new Logger(ListEcosystemService.name);

  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends ListEcosystemQuery>(query: T): Promise<ListEcosystem> {
    const { limit, offset } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset);

    const ecosystems = await this.ecosystemRepository.matching(criteria);

    return ecosystems;
  }
}
