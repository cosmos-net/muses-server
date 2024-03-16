import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateActionCommand } from './create-action.command';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '../../constants/injection-token';
import { ACTION_REPOSITORY } from '../../constants/injection-token';
import { IModuleFacade } from '@module-sub-module/domain/contracts/module-sub-module-facade';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { RelateSubModuleWithModuleEventBody } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module-event-body';
import { RelateSubModuleWithModuleEvent } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module.event';
import { SubModuleNameAlreadyUsedException } from '@module-sub-module/domain/exceptions/sub-module-name-already-used.exception';
import { ModuleToRelateIsDisabledException } from '@module-sub-module/domain/exceptions/module-to-relate-is-disabled.exception';
@Injectable()
export class CreateActionService implements IApplicationServiceCommand<CreateActionCommand> {
  constructor(
    // @Inject(MODULE_FACADE)
    // private moduleFacade: IModuleFacade,
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends CreateActionCommand>(command: T): Promise<SubModule> {
    const { name, description, modules, subModules } = command;

    const isNameAvailable = await this.actionRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new SubModuleNameAlreadyUsedException();
    }

    const subModule = new SubModule();

    subModule.describe(name, description);

    const moduleModel = await this.moduleFacade.getModuleById(module);

    if (!moduleModel.isEnabled) {
      throw new ModuleToRelateIsDisabledException();
    }

    subModule.useModule({
      id: moduleModel.id,
      name: moduleModel.name,
      description: moduleModel.description,
      project: moduleModel.project,
      isEnabled: moduleModel.isEnabled,
      createdAt: moduleModel.createdAt,
      updatedAt: moduleModel.updatedAt,
      deletedAt: moduleModel.deletedAt,
      subModules: moduleModel.subModules,
    });

    await this.subModuleRepository.persist(subModule);

    await this.tryToEmitEvent(
      new RelateSubModuleWithModuleEventBody({
        subModuleId: subModule.id,
        moduleId: module,
      }),
    );

    return subModule;
  }

  private async tryToEmitEvent(relatedSubModuleWithModuleEventBody: RelateSubModuleWithModuleEventBody): Promise<void> {
    try {
      const event = new RelateSubModuleWithModuleEvent(relatedSubModuleWithModuleEventBody);
      await this.eventStoreService.emit(event);
    } catch (error) {
      await this.subModuleRepository.delete(relatedSubModuleWithModuleEventBody.subModuleId);
      throw new InternalServerErrorException();
    }
  }
}
