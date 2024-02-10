import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { IProjectSchema, Project } from '@app-main/modules/project/domain/aggregate/project';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListProject } from '@module-project/domain/aggregate/list-project';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class TypeOrmProjectRepository extends TypeormRepository<ProjectEntity> implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: MongoRepository<ProjectEntity>,
  ) {
    super();
  }

  async persist(model: Project): Promise<Project> {
    let partialSchema: Partial<IProjectSchema & ProjectEntity> = model.entityRootPartial();

    if (partialSchema.id) {
      const { id, ...restParams } = partialSchema;
      const objectId = new ObjectId(id);

      partialSchema = {
        ...restParams,
        _id: objectId,
        id: objectId,
      };
    }

    if (partialSchema.ecosystem) {
      const { ecosystem } = partialSchema;
      const objectId = new ObjectId(ecosystem.id);

      partialSchema = {
        ...partialSchema,
        ecosystem: objectId,
      };
    }

    const project = await this.projectRepository.save(partialSchema);

    model.fromPrimitives({
      ...project,
      ...(project.ecosystem && { ecosystem: project.ecosystem.toHexString() }),
      id: project._id.toHexString(),
    });

    return model;
  }

  async softDeleteBy(project: Project): Promise<number | undefined> {
    const result = await this.projectRepository.update(new ObjectId(project.id), project.entityRootPartial());

    if (result.affected === 0) {
      throw new InternalServerErrorException('The ecosystem could not be deleted');
    }

    return result.affected;
  }

  async searchOneBy(id: string): Promise<Project | null> {
    const projectFound = await this.projectRepository.findOneBy({ _id: new ObjectId(id) });

    if (!projectFound) {
      return null;
    }

    const project = new Project({
      ...projectFound,
      ...(projectFound.ecosystem && { ecosystem: projectFound.ecosystem.toHexString() }),
      id: projectFound._id.toHexString(),
    });

    return project;
  }

  async searchListBy(criteria: Criteria): Promise<ListProject> {
    const query = this.getQueryByCriteria(criteria);

    const [projects, total] = await this.projectRepository.findAndCount(query);

    const projectsClean = projects.map((project) => ({
      ...project,
      ...(project.ecosystem && { ecosystem: project.ecosystem.toHexString() }),
      id: project._id.toHexString(),
    }));

    const list = new ListProject(projectsClean, total);

    return list;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const result = await this.projectRepository.findOne({
      where: { name },
    });

    return !result;
  }
}
