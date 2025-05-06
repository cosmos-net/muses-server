import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { ListProjectQuery } from '@module-project/application/use-cases/list-project/list-project.query';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { ECOSYSTEM_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ListProject } from '@module-project/domain/aggregate/list-project';
import { Filters } from '@core/domain/criteria/filters';
import { Order } from '@core/domain/criteria/order';
import { Criteria } from '@core/domain/criteria/criteria';
import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';

@Injectable()
export class ListProjectService implements IApplicationServiceQuery<ListProjectQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
  ) {}

  async process<T extends ListProjectQuery>(query: T): Promise<ListProject> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const projects = await this.projectRepository.searchListBy(criteria);

    await this.populateEcosystems(projects);

    return projects;
  }

  private async populateEcosystems(projectList: ListProject): Promise<void> {
    const projects = projectList.items;

    for await (const project of projects) {
      if (project.ecosystemId) {
        const ecosystem = await this.ecosystemModuleFacade.getEcosystemById(project.ecosystemId);
        project.useEcosystem(ecosystem);
      }
    }
  }
}
