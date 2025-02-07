import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionCommand } from '@module-action/application/use-cases/action/create-action/create-action.command';
import {
  ACTION_CATALOG_REPOSITORY,
  ACTION_REPOSITORY,
  HADES_SERVER_CONNECTION_PROXY_NAME,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { ActionNameAlreadyUsedException } from '@module-action/domain/exceptions/action-name-already-used.exception';
import { Action } from '@module-action/domain/aggregate/action';
import { EventStoreService } from '@core/application/event-store.service';
import { RelateActionWithSubModuleEvent } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module.event';
import { RelateActionWithSubModuleEventBody } from '@module-action/domain/events/relate-sub-module-with-action/relate-action-with-sub-module-event-body';
import { RelateActionWithModuleEventBody } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module-event-body';
import { RelateActionWithModuleEvent } from '@module-action/domain/events/relate-module-with-action/relate-action-with-module.event';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';
import { SubModuleNotFoundException } from '@module-common/domain/exceptions/sub-module-not-found.exception';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CreateActionService implements IApplicationServiceCommand<CreateActionCommand> {
  constructor(
    private readonly eventStoreService: EventStoreService,
    @Inject(ACTION_REPOSITORY)
    private readonly actionRepository: IActionRepository,
    @Inject(ACTION_CATALOG_REPOSITORY)
    private readonly actionCatalogRepository: IActionCatalogRepository,
    @Inject(MODULE_FACADE)
    private readonly moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private readonly subModuleFacade: ISubModuleFacade,
    @Inject(HADES_SERVER_CONNECTION_PROXY_NAME)
    private readonly clientProxy: ClientProxy,
  ) {}

  async process<T extends CreateActionCommand>(command: T): Promise<Action> {
    const { name, description, moduleId, submoduleId, actionCatalog } = command;

    const isNameAvailable = await this.actionRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ActionNameAlreadyUsedException();
    }

    const actionCatalogModel = await this.actionCatalogRepository.oneBy(actionCatalog);

    if (!actionCatalogModel) {
      throw new NotFoundException(`Action catalog with name ${actionCatalog} not found`);
    }

    const action = new Action();

    action.categorize(actionCatalogModel);
    action.describe(name, description);

    const modulesFound = await this.moduleFacade.getModuleByIds([moduleId]);

    if (modulesFound.totalItems === 0) {
      throw new ModuleNotFoundException();
    }

    const module = modulesFound.entities()[0];
    action.useModule(module);

    if (submoduleId) {
      const subModulesFound = await this.subModuleFacade.getSubModuleByIds([submoduleId]);

      if (subModulesFound.totalItems === 0) {
        throw new SubModuleNotFoundException();
      }

      const subModule = subModulesFound.entities()[0];
      action.useSubmodule(subModule);
    }

    await this.actionRepository.persist(action);

    //TODO: if the action is for a specific sub module, the module not should be related with the action, only the sub module, but if the sub module is not defined, the module should be related with the action

    const isOnlyForModule = !submoduleId;
    const isOnlyForSubModule = submoduleId && moduleId;

    if (isOnlyForModule) {
      await this.tryToEmitModuleEvent(
        new RelateActionWithModuleEventBody({
          actionId: action.id,
          modules: [moduleId],
        }),
      );
    } else if (isOnlyForSubModule) {
      await this.tryToEmitSubModuleEvent(
        new RelateActionWithSubModuleEventBody({
          actionId: action.id,
          subModules: [submoduleId],
        }),
      );
    }

    await lastValueFrom(
      this.clientProxy.send(
        { 
          cmd: 'HADES.PERMISSION.CREATE'
        },
        {
          actionUUID: action.id,
          actionName: action.name,
          modules: action.moduleId,
          subModule: action.submoduleId ?? null,
        }
      ),
    );

    return action;
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
