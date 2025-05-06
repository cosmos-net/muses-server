import { Injectable } from '@nestjs/common';
import { UpdateRelationWithEcosystemEvent } from '@module-project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem.event';
import { AddProjectService } from '../use-cases/add-project-service/add-project.service';
import { RemoveProjectService } from '../use-cases/remove-project-service/remove-project.service';

@Injectable()
export class UpdateRelationsWithProjectEventHandler {
  constructor(
    private readonly addProjectService: AddProjectService,
    private readonly removeProjectService: RemoveProjectService,
  ) {}

  public async handle(payload: UpdateRelationWithEcosystemEvent): Promise<void> {
    const {
      body: { ecosystemToRelateProject, ecosystemToUnRelateProject, projectId },
    } = payload;

    await this.addProjectService.process({
      ecosystemId: ecosystemToRelateProject,
      projectId,
    });

    await this.removeProjectService.process({
      ecosystemId: ecosystemToUnRelateProject,
      projectId,
    });
  }
}
