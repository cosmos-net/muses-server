import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { Project } from '@app-main/modules/project/domain/aggregate/project';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListProject } from '@module-project/domain/aggregate/list-project';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';

@Injectable()
export class TypeOrmProjectRepository extends TypeormRepository<ProjectEntity> implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: MongoRepository<ProjectEntity>,
  ) {
    super();
  }

  async persist(model: Project): Promise<Project> {
    const schemaPartial = model.entityRootPartial();
    const project = await this.projectRepository.save(schemaPartial);

    model.fromPrimitives({
      ...project,
      id: project._id.toHexString(),
    });

    return model;
  }

  async softDeleteBy(id: string): Promise<number | undefined> {
    const result = await this.projectRepository.softDelete(id);

    return result.affected;
  }

  async searchOneBy(id: string): Promise<Project | null> {
    const projectFound = await this.projectRepository.findOneBy({ id });

    if (!projectFound) {
      return null;
    }

    const project = new Project(projectFound);

    return project;
  }

  async searchListBy(criteria: Criteria): Promise<ListProject> {
    const query = this.getQueryByCriteria(criteria);

    const [projects, total] = await this.projectRepository.findAndCount(query);

    const list = new ListProject(projects, total);

    return list;
  }
}
