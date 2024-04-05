import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { Inject, Injectable } from '@nestjs/common';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { GetActionQuery } from '@module-action/application/use-cases/get-action/get-action.query';
import { Action } from '@module-action/domain/aggregate/action';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';

@Injectable()
export class GetActionService implements IApplicationServiceQuery<GetActionQuery> {
  constructor(
    @Inject(MODULE_FACADE)
    private readonly moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private readonly subModuleFacade: ISubModuleFacade,
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
  ) {}

  async process<T extends GetActionQuery>(query: T): Promise<Action> {
    const { id, withDisabled } = query;

    const action = await this.actionRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (action === null) {
      throw new ActionNotFoundException();
    }

    if (action.modules && action.modules.length > 0) {
      const modules = await this.moduleFacade.getModuleByIds(action.modulesIds);
      action.useModules(modules.entities());
    }

    if (action.subModules && action.subModules.length > 0) {
      const subModules = await this.subModuleFacade.getSubModuleByIds(action.subModulesIds);
      action.useSubModules(subModules.entities());
    }

    return action;
  }
}
