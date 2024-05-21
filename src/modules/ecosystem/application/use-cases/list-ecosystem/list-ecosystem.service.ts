import { Inject, Injectable } from '@nestjs/common';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { ListEcosystemQuery } from '@module-eco/application/use-cases/list-ecosystem/list-ecosystem.query';
import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { ListEcosystem } from '@module-eco/domain/list-ecosystem';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';
import { Filters } from '@core/domain/criteria/filters';
import { Order } from '@core/domain/criteria/order';
import { Criteria } from '@core/domain/criteria/criteria';

@Injectable()
export class ListEcosystemService implements IApplicationServiceQuery<ListEcosystemQuery> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
  ) {}

  async process<T extends ListEcosystemQuery>(query: T): Promise<ListEcosystem> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const ecosystems = await this.ecosystemRepository.matching(criteria);

    return ecosystems;
  }
}
