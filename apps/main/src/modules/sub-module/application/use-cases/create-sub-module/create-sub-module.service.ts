import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubModuleCommand } from './create-sub-module.command';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '../../constants/injection-token';
import { IModuleFacade } from '@module-sub-module/domain/contracts/module-sub-module-facade';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { RelateSubModuleWithModuleEventBody } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module-event-body';
import { RelateSubModuleWithModuleEvent } from '@module-sub-module/domain/events/relate-sub-module-with-module-event/relate-sub-module-with-module.event';
import { SubModuleNameAlreadyUsedException } from '@module-sub-module/domain/exceptions/sub-module-name-already-used.exception';

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
    const { name, description, module, isEnabled } = command;

    const isNameAvailable = await this.subModuleRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new SubModuleNameAlreadyUsedException();
    }

    const subModule = new SubModule();

    subModule.describe(name, description);

    if (isEnabled === false) {
      subModule.disable();
    }

    const moduleModel = await this.moduleFacade.getModuleById(module);
    subModule.useModule(moduleModel);

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
