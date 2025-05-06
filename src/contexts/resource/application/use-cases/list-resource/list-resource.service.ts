import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { ListResourceQuery } from '@module-resource/application/use-cases/list-resource/list-resource.query';
import { IActionFacade } from '@module-resource/domain/contracts/action-facade';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { RESOURCE_REPOSITORY, FACADE_ACTION } from '@module-resource/application/constants/injection-token';
import { Criteria } from '@core/domain/criteria/criteria';
import { Filters } from '@core/domain/criteria/filters';
import { Order } from '@core/domain/criteria/order';
import { Resource } from '@module-resource/domain/aggregate/resource';
import { ListResource } from '@module-resource/domain/aggregate/list-resource';

@Injectable()
export class ListResourceService implements IApplicationServiceQuery<ListResourceQuery> {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(FACADE_ACTION)
    private actionFacade: IActionFacade,
  ) {}

  async process<T extends ListResourceQuery>(query: T): Promise<ListResource> {
    const { limit, offset, withDeleted } = query;

    const filters = Filters.fromValues(query.filters);
    const order = Order.fromValues(query.orderBy, query.orderType);

    const criteria = new Criteria(filters, order, limit, offset, withDeleted);

    const resources = await this.resourceRepository.searchListBy(criteria);

    for await (const resource of resources.items) {
      await this.populateTriggers(resource);
      await this.populateActions(resource);
    }

    return resources;
  }

  private async populateTriggers(resource: Resource) {
    if (resource.triggersIds.length > 0) {
      const triggers = await this.resourceRepository.searchListBy(resource.triggersIds, true);

      resource.useTriggers(triggers.entities());
    }
  }

  private async populateActions(resource: Resource) {
    if (resource.actionsIds.length > 0) {
      const actions = await this.actionFacade.getActionByIds(resource.actionsIds);

      resource.useActions(actions.entities());
    }
  }
}
