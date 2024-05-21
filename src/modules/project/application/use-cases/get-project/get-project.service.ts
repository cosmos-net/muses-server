import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetProjectQuery } from '@module-project/application/use-cases/get-project/get-project.query';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { Project } from '@module-project/domain/aggregate/project';
import { ECOSYSTEM_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';
import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';

@Injectable()
export class GetProjectService implements IApplicationServiceQuery<GetProjectQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
  ) {}

  async process<T extends GetProjectQuery>(query: T): Promise<Project> {
    const { id, withDisabled: withDeleted, withEcosystem } = query;

    const project = await this.projectRepository.searchOneBy(id, withDeleted);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    if (withEcosystem && project.ecosystemId) {
      const ecosystem = await this.ecosystemModuleFacade.getEcosystemById(project.ecosystemId);

      project.useEcosystem(ecosystem);
    }

    return project;
  }
}
