import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { Project } from '@module-project/domain/aggregate/project';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { ListProject } from '@module-project/domain/aggregate/list-project';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { ObjectId } from 'mongodb';
import { IProjectSchema } from '@module-project/domain/aggregate/project.schema';

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

    if (partialSchema?.ecosystem) {
      const objectId = new ObjectId(partialSchema.ecosystem);

      partialSchema = {
        ...partialSchema,
        ecosystem: objectId,
      };
    }

    if (partialSchema?.modules?.length && partialSchema?.modules.length > 0) {
      const modules = partialSchema.modules.map((module) => new ObjectId(module));

      partialSchema = {
        ...partialSchema,
        modules,
      };
    }

    if (partialSchema.id) {
      const { id, ...restParams } = partialSchema;

      const _id = new ObjectId(id);

      const project = (await this.projectRepository.findOneAndReplace(
        { _id },
        {
          ...restParams,
          createdAt: new Date(),
        },
        {
          returnDocument: 'after',
        },
      )) as ProjectEntity;

      model.fromPrimitives({
        ...project,
        ...(project.modules && { modules: project.modules.map((module) => module.toHexString()) }),
        ...(project.ecosystem && { ecosystem: project.ecosystem.toHexString() }),
        id: project._id.toHexString(),
      });

      return model;
    }

    const project = await this.projectRepository.save(partialSchema);

    model.fromPrimitives({
      ...project,
      ...(project.modules && { modules: project.modules.map((module) => module.toHexString()) }),
      ...(project.ecosystem && { ecosystem: project.ecosystem.toHexString() }),
      id: project._id.toHexString(),
    });

    return model;
  }

  async softDeleteBy(model: Project): Promise<number | undefined> {
    model.disable();

    let partialSchema: Partial<IProjectSchema & ProjectEntity> = model.entityRootPartial();

    if (partialSchema?.ecosystem?.id) {
      const { id } = partialSchema.ecosystem;
      const objectId = new ObjectId(id);

      partialSchema = {
        ...partialSchema,
        ecosystem: objectId,
      };
    }

    const { id, ...partialParams } = partialSchema;

    const result = await this.projectRepository.updateOne({ _id: new ObjectId(id) }, { $set: partialParams });

    if (result.modifiedCount === 0) {
      throw new InternalServerErrorException('The ecosystem could not be deleted');
    }

    return result.modifiedCount;
  }

  async searchOneBy(id: string, withDeleted: boolean): Promise<Project | null> {
    const projectFound = await this.projectRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted,
    });

    if (!projectFound) {
      return null;
    }

    const project = new Project({
      ...projectFound,
      ...(projectFound.modules && { modules: projectFound.modules.map((module) => module.toHexString()) }),
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
      ...(project.modules && { modules: project.modules.map((module) => module.toHexString()) }),
      ...(project.ecosystem && { ecosystem: project.ecosystem.toHexString() }),
      id: project._id.toHexString(),
    }));

    const list = new ListProject(projectsClean, total);

    return list;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const result = await this.projectRepository.findOne({ where: { name }, withDeleted: true });

    return !result;
  }

  async removeEcosystem(projectId: string, ecosystem: string): Promise<void> {
    const updateResult = await this.projectRepository.updateOne(
      { _id: new ObjectId(projectId) },
      { $unset: { ecosystem: new ObjectId(ecosystem) } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new InternalServerErrorException('The ecosystem could not be removed');
    }
  }
}
