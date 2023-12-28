import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { EcosystemEntity } from '@app-main/modules/commons/infrastructure';
import { Ecosystem, ListEcosystem } from '@app-main/modules/ecosystem/domain';
import { IPaginationOrder } from '@lib-commons/domain';
import { ObjectId } from 'mongodb';

@Injectable()
export class TypeOrmMongoEcosystemRepository implements IEcosystemRepository {
  constructor(
    @InjectRepository(EcosystemEntity)
    private readonly ecosystemRepository: Repository<EcosystemEntity>,
  ) {}

  async persist(model: Ecosystem): Promise<void> {
    const ecosystem = await this.ecosystemRepository.save(model.entityRoot());
    model.hydrate(ecosystem);
  }

  async byNameOrFail(name: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOneBy({ name });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

  async byIdOrFail(id: string): Promise<Ecosystem> {
    const objId = new ObjectId(id);

    const ecosystem = await this.ecosystemRepository.findOneBy({
      _id: objId,
    });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

  async update(model: Ecosystem): Promise<Ecosystem> {
    await this.ecosystemRepository.update(
      { _id: model._id },
      { name: model.name, description: model.description, enabled: model.isEnabled, updatedAt: new Date() },
    );

    return model;
  }

  async list(paginationOrder?: IPaginationOrder): Promise<ListEcosystem> {
    const params: FindManyOptions = {};

    if (paginationOrder) {
      const { options } = paginationOrder;
      const { pagination, order, filter } = options;

      params.take = pagination.limit;
      params.skip = pagination.offset;

      params.order = {
        [order.by]: order.direction,
      };

      if (filter?.by) {
        const where: FindOptionsWhere<EcosystemEntity> = {};

        Object.keys(filter.by).forEach((key) => {
          where[key] = filter.by[key];
        });

        params.where = where;
      }
    }

    const [ecosystems, total] = await this.ecosystemRepository.findAndCount(params);

    const listEcosystem = new ListEcosystem(ecosystems, total);

    return listEcosystem;
  }
}
