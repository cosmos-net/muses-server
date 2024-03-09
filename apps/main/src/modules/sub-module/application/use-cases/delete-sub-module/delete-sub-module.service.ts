import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SubModuleNotFoundException } from '@module-sub-module/domain/exceptions/sub-module-not-found.exception';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { DeleteSubModuleCommand } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.command';
import { RemoveDisabledSubModuleFromModuleEventBody } from '@module-sub-module/domain/events/remove-disabled-sub-module-from-module-event/remove-disabled-sub-module-from-module-event.body';
import { RemoveDisabledSubModuleFromModuleEvent } from '@module-sub-module/domain/events/remove-disabled-sub-module-from-module-event/remove-disabled-sub-module-from-module.event';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';

@Injectable()
export class DeleteSubModuleService implements IApplicationServiceCommand<DeleteSubModuleCommand> {
  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends DeleteSubModuleCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const subModule = await this.subModuleRepository.searchOneBy(id, {
      withDeleted: true,
    });

    if (!subModule) {
      throw new SubModuleNotFoundException();
    }

    const result = await this.subModuleRepository.softDeleteBy(subModule);

    await this.tryToEmitEvent(subModule, {
      subModuleId: subModule.id,
      moduleId: subModule.moduleId,
    });

    return result;
  }

  private async tryToEmitEvent(
    subModule: SubModule,
    removeDisabledSubModuleFromModuleEventBody: RemoveDisabledSubModuleFromModuleEventBody,
  ): Promise<any[]> {
    try {
      const event = new RemoveDisabledSubModuleFromModuleEvent(removeDisabledSubModuleFromModuleEventBody);
      return await this.eventStoreService.emit(event);
    } catch (err) {
      subModule.restore();
      await this.subModuleRepository.persist(subModule);
      throw new InternalServerErrorException(err);
    }
  }
}
