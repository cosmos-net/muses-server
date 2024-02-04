import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { Project, IProjectSchema } from '@module-project/domain/aggregate/project.aggregate';

@Injectable()
export class TypeOrmProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: MongoRepository<ProjectEntity>,
  ) {}

  async persist(model: Project): Promise<IProjectSchema> {
    const schemaPartial = model.entityRootPartial();
    const project = await this.projectRepository.save(schemaPartial);
    model.fromPrimitives({
      ...project,
      id: project._id.toHexString(),
    });
    return project;
  }
}
