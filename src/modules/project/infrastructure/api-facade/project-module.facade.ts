import { Injectable } from '@nestjs/common';
import { GetProjectService } from '@module-project/application/use-cases/get-project/get-project.service';
import { GetProjectQuery } from '@module-project/application/use-cases/get-project/get-project.query';
import { Project } from '@module-project/domain/aggregate/project';

@Injectable()
export class ProjectModuleFacade {
  constructor(private readonly getProjectService: GetProjectService) {}

  public async retrieveProject(retrieveProjectQuery: GetProjectQuery): Promise<Project> {
    return this.getProjectService.process(retrieveProjectQuery);
  }
}
