import { IApplicationServiceQuery } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { GetProjectQuery } from '@app-main/modules/project/application/use-cases/get-project/get-project.query';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { Project } from '@app-main/modules/project/domain/aggregate/project';
import { PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';

@Injectable()
export class GetProjectService implements IApplicationServiceQuery<GetProjectQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends GetProjectQuery>(query: T): Promise<Project> {
    const { id } = query;

    const project = await this.projectRepository.searchOneBy(id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    return project;
  }
}
