import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ListResource } from '@module-resource/domain/aggregate/list-resource';
import { Resource } from '../../domain/aggregate/resource';
import { ObjectId } from 'mongodb';

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

  async searchListBy(ids: string[]): Promise<ListResource> {
    const resources = await this.resourceRepository.find({
      where: {
        _id: {
          $in: ids.map((id) => new ObjectId(id)),
        },
      },
    });

    const resourceCleaned = resources.map((resource) => new Resource(this.cleanData(resource)));

    return new ListResource(resourceCleaned, resources.length);
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
}
