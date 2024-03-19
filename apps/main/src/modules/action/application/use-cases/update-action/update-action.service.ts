import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateActionCommand } from '@module-action/application/use-cases/update-action/update-action.command';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { Action } from '@module-action/domain/aggregate/action';

@Injectable()
export class UpdateActionService implements IApplicationServiceCommand<UpdateActionCommand> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private subModuleFacade: ISubModuleFacade,
  ) {}

  async process<T extends UpdateActionCommand>(command: T): Promise<Action> {
    const { id, name, description, enabled, modules, subModules } = command;

    const action = await this.actionRepository.searchOneBy(id, { withDeleted: true });

    if (!action) {
      throw new Error('Action not found');
    }

    action.redescribe(name, description);
    action.changeStatus(enabled);

    if (modules) {
      const modulesFound = await this.moduleFacade.getModuleByIds(modules);

      if (modulesFound.totalItems === 0) {
        throw new Error('Modules not found');
      }

      action.useModules(modulesFound.entities());
    }

    if (subModules) {
      const subModulesFound = await this.subModuleFacade.getSubModuleByIds(subModules);

      if (subModulesFound.totalItems === 0) {
        throw new Error('SubModules not found');
      }

      action.useSubModules(subModulesFound.entities());
    }

    return this.actionRepository.persist(action);
  }
}
