import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateSubModuleCommand } from '@module-sub-module/application/use-cases/update-sub-module/update-sub-module.command';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { SubModuleNotFoundException } from '@module-sub-module/domain/exceptions/sub-module-not-found.exception';
import { MODULE_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { SubModuleAlreadyRelatedWithModuleException } from '@module-sub-module/domain/exceptions/sub-module-already-related-with-module.exception';
import { IModuleFacade } from '@module-sub-module/domain/contracts/module-sub-module-facade';
import { OverwriteSubModuleOnModuleEventBody } from '@module-sub-module/domain/events/overwrite-sub-module-on-module-event/overwrite-sub-module-on-module-event-body';
import { OverwriteSubModuleOnModuleEvent } from '@module-sub-module/domain/events/overwrite-sub-module-on-module-event/overwrite-sub-module-on-module.event';

@Injectable()
export class UpdateSubModuleService implements IApplicationServiceCommand<UpdateSubModuleCommand> {
  private backup: SubModule;

  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends UpdateSubModuleCommand>(command: T): Promise<SubModule> {
    const { id, name, description, enabled, module } = command;

    const submodule = await this.subModuleRepository.searchOneBy(id, { withDeleted: true });

    if (!submodule) {
      throw new SubModuleNotFoundException();
    }

    this.backup = submodule.clone();

    let isSubModuleChanged = false;

    if (module) {
      if (submodule.moduleId === module) {
        throw new SubModuleAlreadyRelatedWithModuleException();
      }

      const moduleModel = await this.moduleFacade.getModuleById(module);

      submodule.useModule({
        id: moduleModel.id,
        name: moduleModel.name,
        description: moduleModel.description,
        project: moduleModel.project,
        isEnabled: moduleModel.isEnabled,
        createdAt: moduleModel.createdAt,
        updatedAt: moduleModel.updatedAt,
        deletedAt: moduleModel.deletedAt,
        subModules: moduleModel.subModules,
        actions: moduleModel.actions,
      });

      isSubModuleChanged = true;
    }

    if (name || description) {
      submodule.redescribe(name, description);
    }

    if (enabled !== undefined) {
      submodule.changeStatus(enabled);
    }

    await this.subModuleRepository.persist(submodule);

    if (isSubModuleChanged) {
      await this.tryToEmitEvent({
        subModuleId: submodule.id,
        previousModuleId: this.backup.moduleId,
        newModuleId: submodule.moduleId,
      });
    }

    return submodule;
  }

  private async tryToEmitEvent(overwriteModuleOnProjectEventBody: OverwriteSubModuleOnModuleEventBody) {
    try {
      const event = new OverwriteSubModuleOnModuleEvent(overwriteModuleOnProjectEventBody);
      await this.eventStoreService.emit(event);
    } catch (err) {
      this.subModuleRepository.persist(this.backup);
      throw new InternalServerErrorException();
    }
  }
}
