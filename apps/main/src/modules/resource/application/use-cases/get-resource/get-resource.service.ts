import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetResourceQuery } from '@module-resource/application/use-cases/get-resource/get-resource.query';
import { RESOURCE_REPOSITORY, FACADE_ACTION } from '@module-resource/application/constants/injection-token';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { ResourceNotFoundException } from '@module-resource/domain/exceptions/resource-not-found.exception';
import { Resource } from '@module-resource/domain/aggregate/resource';
import { IActionFacade } from '@module-resource/domain/contracts/action-facade';

@Injectable()
export class GetResourceService implements IApplicationServiceQuery<GetResourceQuery> {
  private resourceModel: Resource;

  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(FACADE_ACTION)
    private actionFacade: IActionFacade,
  ) {}

  async process<T extends GetResourceQuery>(query: T): Promise<Resource> {
    const { id, withDisabled } = query;

    const resource = await this.resourceRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (!resource) {
      throw new ResourceNotFoundException();
    }

    this.resourceModel = resource;

    await this.populateTriggers();
    await this.populateActions();

    return this.resourceModel;
  }

  private async populateTriggers() {
    if (this.resourceModel.triggers) {
      const triggersIds = this.resourceModel.triggersIds;

      const triggers = await this.resourceRepository.searchListBy(triggersIds);

      this.resourceModel.useTriggers(triggers.entities());
    }
  }

  private async populateActions() {
    if (this.resourceModel.actions) {
      const actionsIds = this.resourceModel.actionsIds;

      const actions = await this.actionFacade.getActionByIds(actionsIds);

      this.resourceModel.useActions(actions.entities());
    }
  }
}
