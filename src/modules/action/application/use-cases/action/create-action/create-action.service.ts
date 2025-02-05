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
    const { name, description, modules, subModules, actionCatalog } = command;

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

    if (modules && modules.length > 0) {
      const modulesFound = await this.moduleFacade.getModuleByIds(modules);

      if (modulesFound.totalItems === 0) {
        throw new ModuleNotFoundException();
      }

      action.useModules(modulesFound.entities());
    }

    if (subModules && subModules.length > 0) {
      const subModulesFound = await this.subModuleFacade.getSubModuleByIds(subModules);

      if (subModulesFound.totalItems === 0) {
        throw new SubModuleNotFoundException();
      }

      action.useSubModules(subModulesFound.entities());
    }

    await this.actionRepository.persist(action);

    if (action.modules && action.modules.length > 0) {
      await this.tryToEmitModuleEvent(
        new RelateActionWithModuleEventBody({
          actionId: action.id,
          modules: action.modulesIds,
        }),
      );
    }

    if (action.modules && action.modules.length > 0) {
      await this.tryToEmitSubModuleEvent(
        new RelateActionWithSubModuleEventBody({
          actionId: action.id,
          subModules: action.subModulesIds,
        }),
      );
    }

    await lastValueFrom(
      this.clientProxy.send(
        { 
          cmd: 'muses.action.create'
        },
        {
          actionUUID: action.id,
          actionName: action.name,
          modules: action.modulesIds,
          subModules: action.subModulesIds,
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
