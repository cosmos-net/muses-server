import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { CreateActionCommand } from './create-action.command';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { ActionNameAlreadyUsedException } from '@app-main/modules/action/domain/exceptions/action-name-already-used.exception';
import { Action } from '@module-action/domain/aggregate/action';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { RelateActionWithSubModuleEvent } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module.event';
import { RelateActionWithSubModuleEventBody } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module-event-body';
import { RelateActionWithModuleEventBody } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module-event-body';
import { RelateActionWithModuleEvent } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module.event';

@Injectable()
export class CreateActionService implements IApplicationServiceCommand<CreateActionCommand> {
  constructor(
    private readonly eventStoreService: EventStoreService,
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private subModuleFacade: ISubModuleFacade,
  ) {}

  async process<T extends CreateActionCommand>(command: T): Promise<Action> {
    const { name, description, modules, subModules } = command;

    const isNameAvailable = await this.actionRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ActionNameAlreadyUsedException();
    }

    const action = new Action();

    action.describe(name, description);

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

    const newAction = await this.actionRepository.persist(action);

    await this.tryToEmitModuleEvent(
      new RelateActionWithModuleEventBody({
        actionId: newAction.id,
        modules: newAction.modules.map((module) => module),
      }),
    );

    await this.tryToEmitSubModuleEvent(
      new RelateActionWithSubModuleEventBody({
        actionId: newAction.id,
        subModules: newAction.subModules.map((subModule) => subModule),
      }),
    );

    return newAction;
  }

  private async tryToEmitModuleEvent(relatedActionWithModuleEventBody: RelateActionWithModuleEventBody): Promise<void> {
    const event = new RelateActionWithModuleEvent(relatedActionWithModuleEventBody);
    await this.eventStoreService.emit(event);
  }

  private async tryToEmitSubModuleEvent(
    relatedActionWithModuleEventBody: RelateActionWithSubModuleEventBody,
  ): Promise<void> {
    const event = new RelateActionWithSubModuleEvent(relatedActionWithModuleEventBody);
    await this.eventStoreService.emit(event);
  }
}
