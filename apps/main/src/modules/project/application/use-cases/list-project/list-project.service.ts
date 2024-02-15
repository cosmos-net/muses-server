import { IApplicationServiceQuery } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { ListProjectQuery } from '@module-project/application/use-cases/list-project/list-project.query';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ListProject } from '@module-project/domain/aggregate/list-project';
import { Filters } from '@lib-commons/domain/criteria/filters';
import { Order } from '@lib-commons/domain/criteria/order';
import { Criteria } from '@lib-commons/domain/criteria/criteria';

@Injectable()
export class ListProjectService implements IApplicationServiceQuery<ListProjectQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends ListProjectQuery>(query: T): Promise<ListProject> {
    const { limit, offset } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset);

    const projects = await this.projectRepository.searchListBy(criteria);

    return projects;
  }
}
