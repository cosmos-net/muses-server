import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { Project, IProject } from '@module-project/domain/aggregate/project.aggregate';

@Injectable()
export class TypeOrmProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: MongoRepository<ProjectEntity>,
  ) {}

  async persist(model: Project): Promise<IProject> {
    const primitivies = model.toPrimitives();
    const project = await this.projectRepository.save(primitivies);
    return project;
  }
}
