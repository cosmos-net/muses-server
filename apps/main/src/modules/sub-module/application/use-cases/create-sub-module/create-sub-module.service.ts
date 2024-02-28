import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { CreateSubModuleCommand } from './create-sub-module.command';
import { SUB_MODULE_MODULE_FACADE, SUB_MODULE_REPOSITORY } from '../../constants/injection-token';
import { ISubModuleModuleFacade } from '@app-main/modules/sub-module/domain/contracts/module-sub-module-facade';
import { ISubModuleRepository } from '@app-main/modules/sub-module/domain/contracts/sub-module-repository';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { SubModule } from '@app-main/modules/sub-module/domain/aggregate/sub-module';
import { RelateSubModuleWithModuleEventBody } from '@app-main/modules/sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module-event-body';
import { RelateSubModuleWithModuleEvent } from '@app-main/modules/sub-module/domain/events/relate-sub-module-with-module-event/realte-sub-module-with-module.event';

@Injectable()
export class CreateSubModuleService implements IApplicationServiceCommand<CreateSubModuleCommand> {
  constructor(
    @Inject(SUB_MODULE_MODULE_FACADE)
    private subModuleModuleFacade: ISubModuleModuleFacade,
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends CreateSubModuleCommand>(command: T): Promise<SubModule> {
    const { name, description, module, enabled } = command;

    const isNameAvailable = await this.subModuleRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new Error('Name already taken');
    }

    const subModule = new SubModule();

    subModule.describe(name, description);

    if (enabled === false) {
      subModule.disable();
    }

    if (module) {
      const moduleModel = await this.subModuleModuleFacade.getModuleById(module);

      if (!moduleModel.isEnabled) {
        throw new Error('Module is disabled');
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
      });

      await this.subModuleRepository.persist(subModule);

      await this.tryToEmitEvent(
        new RelateSubModuleWithModuleEventBody({
          subModuleId: subModule.id,
          moduleId: module,
        }),
      );
    }

    return subModule;
  }

  private async tryToEmitEvent(relatedSubModuleWithModuleEventBody: RelateSubModuleWithModuleEventBody): Promise<void> {
    try {
      const event = new RelateSubModuleWithModuleEvent(relatedSubModuleWithModuleEventBody);
      await this.eventStoreService.emit(event);
    } catch (error) {
      await this.subModuleRepository.delete(relatedSubModuleWithModuleEventBody.subModuleId);
      throw new Error('Error trying to emit event');
    }
  }
}
