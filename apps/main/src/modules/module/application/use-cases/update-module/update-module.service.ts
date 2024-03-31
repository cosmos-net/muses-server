import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateModuleCommand } from '@module-module/application/use-cases/update-module/update-module.command';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { Module } from '@module-module/domain/aggregate/module';
import { ModuleAlreadyRelatedWithProject } from '@module-module/domain/exceptions/module-already-related-with-project.exception';
import { OverwriteModuleOnProjectEventBody } from '@module-module/domain/events/overwrite-module-on-project-event/overwrite-module-on-project-event-body';
import { OverwriteModuleOnProjectEvent } from '@module-module/domain/events/overwrite-module-on-project-event/overwrite-module-on-project.event';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';

@Injectable()
export class UpdateModuleService implements IApplicationServiceCommand<UpdateModuleCommand> {
  private backup: Module;

  constructor(
    @Inject(PROJECT_MODULE_FACADE)
    private projectModuleFacade: IProjectModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends UpdateModuleCommand>(command: T): Promise<Module> {
    const { id, name, description, enabled, project } = command;

    const module = await this.moduleRepository.searchOneBy(id, { withDeleted: true });

    if (!module) {
      throw new ModuleNotFoundException();
    }

    this.backup = module.clone();

    let isProjectChanged = false;

    if (project) {
      if (module.projectId === project) {
        throw new ModuleAlreadyRelatedWithProject();
      }

      const projectModel = await this.projectModuleFacade.getProjectById(project);
      module.useProject(projectModel);

      isProjectChanged = true;
    }

    if (name || description) {
      module.redescribe(name, description);
    }

    if (enabled !== undefined) {
      module.changeStatus(enabled);
    }

    await this.moduleRepository.persist(module);

    if (isProjectChanged) {
      const eventBody = new OverwriteModuleOnProjectEventBody({
        moduleId: module.id,
        previousProjectId: this.backup.projectId,
        newProjectId: module.projectId,
      });

      await this.tryToEmitEvent(eventBody);
    }

    return module;
  }

  private async tryToEmitEvent(overwriteModuleOnProjectEventBody: OverwriteModuleOnProjectEventBody) {
    try {
      const event = new OverwriteModuleOnProjectEvent(overwriteModuleOnProjectEventBody);
      await this.eventStoreService.emit(event);
    } catch (err) {
      this.moduleRepository.persist(this.backup);
      throw new InternalServerErrorException();
    }
  }
}
