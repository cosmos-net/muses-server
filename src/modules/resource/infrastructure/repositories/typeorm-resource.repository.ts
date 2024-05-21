import { TypeormRepository } from '@core/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ListResource } from '@module-resource/domain/aggregate/list-resource';
import { Resource } from '../../domain/aggregate/resource';
import { ObjectId } from 'mongodb';
import { Criteria } from '@core/domain/criteria/criteria';

@Injectable()
export class TypeOrmResourceRepository extends TypeormRepository<ResourceEntity> implements IResourceRepository {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: MongoRepository<ResourceEntity>,
  ) {
    super();
  }

  private cleanData(resource: ResourceEntity) {
    return {
      ...resource,
      ...(resource.triggers && { triggers: resource.triggers.map((trigger) => trigger.toHexString()) }),
      ...(resource.actions && { actions: resource.actions.map((action) => action.toHexString()) }),
      id: resource._id.toHexString(),
    };
  }

  private async listByIds(ids: string[], withDeleted: boolean): Promise<ListResource> {
    const resources = await this.resourceRepository.find({
      withDeleted,
      where: {
        _id: {
          $in: ids.map((id) => new ObjectId(id)),
        },
      },
    });

    const resourceCleaned = resources.map((resource) => new Resource(this.cleanData(resource)));

    return new ListResource(resourceCleaned, resources.length);
  }

  private async listByCriteria(criteria: Criteria): Promise<ListResource> {
    const query = this.getQueryByCriteria(criteria);

    const [resources, total] = await this.resourceRepository.findAndCount(query);

    const resourceCleaned = resources.map((resource) => new Resource(this.cleanData(resource)));

    return new ListResource(resourceCleaned, total);
  }

  searchListBy(ids: string[], withDeleted?: boolean): Promise<ListResource>;
  searchListBy(criteria: Criteria): Promise<ListResource>;
  async searchListBy(idsOrCriteria: string[] | Criteria, withDeleted?: boolean): Promise<ListResource> {
    if (idsOrCriteria instanceof Criteria) {
      return this.listByCriteria(idsOrCriteria);
    }

    return this.listByIds(idsOrCriteria, withDeleted === undefined ? false : withDeleted);
  }

  async searchOneBy(
    id: string,
    options: {
      withDeleted: boolean;
    },
  ): Promise<Resource | null> {
    const resource = await this.resourceRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
      withDeleted: options?.withDeleted,
    });

    if (!resource) {
      return null;
    }

    return new Resource(this.cleanData(resource));
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const resource = await this.resourceRepository.findOne({ where: { name }, withDeleted: true });

    return !resource;
  }

  async persist(model: Resource): Promise<Resource> {
    let partialSchema: Partial<ResourceEntity> = model.entityRootPartial();

    if (partialSchema.triggers) {
      const triggers = partialSchema.triggers.map((trigger) => new ObjectId(trigger));

      partialSchema = {
        ...partialSchema,
        triggers,
      };
    }

    if (partialSchema.actions) {
      const actions = partialSchema.actions.map((action) => new ObjectId(action));

      partialSchema = {
        ...partialSchema,
        actions,
      };
    }

    if (partialSchema.id) {
      const { id, ...restParams } = partialSchema;

      const _id = new ObjectId(id);

      const resource = (await this.resourceRepository.findOneAndReplace(
        { _id },
        {
          ...restParams,
          updatedAt: new Date(),
        },
      )) as ResourceEntity;

      model.hydrate(this.cleanData(resource));

      return model;
    }

    const resource = await this.resourceRepository.save(partialSchema);

    model.hydrate(this.cleanData(resource));

    return model;
  }
}
