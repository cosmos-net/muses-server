import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateProjectCommand } from '@module-project/application/use-cases/update-project/update-project.command';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { Project } from '@module-project/domain/aggregate/project';
import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';
import { ECOSYSTEM_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';
import { ProjectAlreadyRelatedWithEcosystem } from '@module-project/domain/exceptions/project-already-related-with-ecosystem.exception';
import { UpdateRelationsWithEcosystemEventBody } from '@app-main/modules/project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem-event-body';
import { UpdateRelationWithEcosystemEvent } from '@app-main/modules/project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem.event';
import { EventStoreService } from '@lib-commons/application/event-store.service';

@Injectable()
export class UpdateProjectService implements IApplicationServiceCommand<UpdateProjectCommand> {
  constructor(
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends UpdateProjectCommand>(command: T): Promise<Project> {
    const { id, name, description, isEnabled, ecosystem } = command;

    const project = await this.projectRepository.searchOneBy(id, true);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    const currentEcosystem = project.ecosystemId;
    const isEcosystemChanged = ecosystem !== currentEcosystem;

    if (ecosystem) {
      if (project.ecosystemId === ecosystem) {
        throw new ProjectAlreadyRelatedWithEcosystem();
      }

      const ecosystemModel = await this.ecosystemModuleFacade.getEcosystemById(ecosystem);
      project.useEcosystem(ecosystemModel);
    } else if (ecosystem === null && project.ecosystemId) {
      await this.projectRepository.removeEcosystem(project.id, project.ecosystemId);
      project.removeEcosystem();
    }

    if (name || description) {
      project.redescribe(name, description);
    }

    if (isEnabled !== undefined) {
      isEnabled ? project.enable() : project.disable();
    }

    await this.projectRepository.persist(project);

    if (isEcosystemChanged) {
      await this.tryToEmitEvent({
        projectId: project.id,
        ecosystemToRelateProject: ecosystem ?? '',
        ecosystemToUnRelateProject: currentEcosystem ?? '',
      });
    }

    return project;
  }

  private async tryToEmitEvent(
    updateRelationsWithEcosystemEventBody: UpdateRelationsWithEcosystemEventBody,
  ): Promise<void> {
    const event = new UpdateRelationWithEcosystemEvent(updateRelationsWithEcosystemEventBody);
    await this.eventStoreService.emit(event);
  }
}
