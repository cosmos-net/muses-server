import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { EcosystemEntity } from '@app-main/modules/commons/infrastructure';
import { Ecosystem, ListEcosystem } from '@app-main/modules/ecosystem/domain';
import { IPaginationOrder } from '@lib-commons/domain';

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
    const ecosystem = await this.ecosystemRepository.findOneBy({
      id,
    });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

  async list(paginationOrder?: IPaginationOrder): Promise<ListEcosystem> {
    const params: Record<string, unknown> = {};

    if (paginationOrder) {
      const { options } = paginationOrder;

      if (options) {
        const { pagination, order, filter } = options;

        if (pagination) {
          params.skip = pagination.limit;
          params.take = pagination.take;
        }

        if (order) {
          params.orderBy = order.by;
          params.direction = order.direction;
        }

        if (filter) {
          params.where = filter;
        }
      }
    }

    const ecosystems = await this.ecosystemRepository.find(params);
    const listEcosystem: ListEcosystem = new ListEcosystem(ecosystems);

    return listEcosystem;
  }
}
