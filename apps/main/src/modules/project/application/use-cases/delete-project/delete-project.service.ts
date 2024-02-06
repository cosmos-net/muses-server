import { IApplicationServiceCommand } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteProjectCommand } from '@module-project/application/use-cases/delete-project/delete-project.command';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';

@Injectable()
export class DeleteProjectService implements IApplicationServiceCommand<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends DeleteProjectCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const project = await this.projectRepository.searchOneBy(id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    const result = await this.projectRepository.softDeleteBy(id);

    return result;
  }
}
