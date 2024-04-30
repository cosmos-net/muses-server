import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateModuleCommand } from '@module-module/application/use-cases/create-module/create-module.command';
import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { Module } from '@module-module/domain/aggregate/module';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { ModuleNameAlreadyUsedException } from '@module-module/domain/exceptions/module-name-already-used.exception';
import { ProjectToRelateIsDisabledException } from '@module-module/domain/exceptions/project-to-relate-is-disabled.exception';
import { RelateModuleWithProjectEventBody } from '@module-module/domain/events/relate-module-with-project-event/relate-module-with-project-event-body';
import { RelateModuleWithProjectEvent } from '@module-module/domain/events/relate-module-with-project-event/relate-module-with-project.event';
import { EventStoreService } from '@lib-commons/application/event-store.service';

@Injectable()
export class CreateModuleService implements IApplicationServiceCommand<CreateModuleCommand> {
  constructor(
    @Inject(PROJECT_MODULE_FACADE)
    private projectModuleFacade: IProjectModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends CreateModuleCommand>(command: T): Promise<Module> {
    const { name, description, project, isEnabled } = command;

    const isNameAvailable = await this.moduleRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ModuleNameAlreadyUsedException();
    }

    const module = new Module();

    module.describe(name, description);

    isEnabled === false && module.disable();

    if (project) {
      const projectModel = await this.projectModuleFacade.getProjectById(project);

      if (!projectModel.isEnabled) {
        throw new ProjectToRelateIsDisabledException();
      }

      module.useProject(projectModel);
    }

    await this.moduleRepository.persist(module);

    await this.tryToEmitEvent(
      new RelateModuleWithProjectEventBody({
        moduleId: module.id,
        projectId: project,
      }),
    );

    return module;
  }

  private async tryToEmitEvent(relateModuleWithProjectEventBody: RelateModuleWithProjectEventBody): Promise<void> {
    try {
      const event = new RelateModuleWithProjectEvent(relateModuleWithProjectEventBody);
      await this.eventStoreService.emit(event);
    } catch (err) {
      await this.moduleRepository.delete(relateModuleWithProjectEventBody.moduleId);
      throw new InternalServerErrorException(err);
    }
  }
}
