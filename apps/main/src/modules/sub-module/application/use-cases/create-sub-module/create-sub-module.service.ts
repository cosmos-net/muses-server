import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubModuleCommand } from './create-sub-module.command';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '../../constants/injection-token';
import { IModuleFacade } from '@app-main/modules/sub-module/domain/contracts/module-sub-module-facade';
import { ISubModuleRepository } from '@app-main/modules/sub-module/domain/contracts/sub-module-repository';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { SubModule } from '@app-main/modules/sub-module/domain/aggregate/sub-module';
import { RelateSubModuleWithModuleEventBody } from '@app-main/modules/sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module-event-body';
import { RelateSubModuleWithModuleEvent } from '@app-main/modules/sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module.event';
import { SubModuleNameAlreadyUsedException } from '@module-sub-module/domain/exceptions/sub-module-name-already-used.exception';
import { ModuleToRelateIsDisabledException } from '@module-sub-module/domain/exceptions/module-to-relate-is-disabled.exception';
@Injectable()
export class CreateSubModuleService implements IApplicationServiceCommand<CreateSubModuleCommand> {
  constructor(
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends CreateSubModuleCommand>(command: T): Promise<SubModule> {
    const { name, description, module, enabled } = command;

    const isNameAvailable = await this.subModuleRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new SubModuleNameAlreadyUsedException();
    }

    const subModule = new SubModule();

    subModule.describe(name, description);

    if (enabled === false) {
      subModule.disable();
    }

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
      subModules: subModule,
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
