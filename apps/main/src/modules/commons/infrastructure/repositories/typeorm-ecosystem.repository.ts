import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, MongoRepository } from 'typeorm';
import { IEcosystemRepository } from '@app-main/modules/commons/domain';
import { EcosystemEntity } from '@app-main/modules/commons/infrastructure';
import { Ecosystem, ListEcosystem } from '@app-main/modules/ecosystem/domain';
import { IPaginationOrder } from '@lib-commons/domain';
import { ObjectId } from 'mongodb';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';

@Injectable()
export class TypeOrmEcosystemRepository implements IEcosystemRepository {
  constructor(
    @InjectRepository(EcosystemEntity)
    private readonly ecosystemRepository: MongoRepository<EcosystemEntity>,
  ) {}

  async persist(model: Ecosystem): Promise<void> {
    const ecosystem = await this.ecosystemRepository.save(model.entityRoot());

    model.hydrate({
      ...ecosystem,
      id: ecosystem._id.toHexString(),
    });
  }

  async byNameOrFail(name: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOneBy({ name });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

  async byIdOrFail(id: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: true,
    });

    const domain = new Ecosystem(ecosystem);

    return domain;
  }

  async list(paginationOrder?: IPaginationOrder): Promise<ListEcosystem> {
    const params: MongoFindManyOptions = {};

    if (paginationOrder) {
      const { options } = paginationOrder;
      const { pagination, order, filter } = options;

      params.take = pagination.limit;
      params.skip = pagination.offset;

      params.order = {
        [order.by]: order.direction,
      };

      if (filter?.by) {
        const where: FindOneOptions<EcosystemEntity> = {};
        Object.keys(filter.by).forEach((key) => {
          if (key === 'createdAtTo') {
            return;
          } else if (key === 'createdAt') {
            const { createdAt, createdAtTo } = filter.by;
            let pivotDate: string;
            let pivotDateTo: string;

            try {
              pivotDate = new Date(createdAt as string).toLocaleString('en-US', {
                timeZone: 'America/Tijuana',
              });

              if (createdAtTo) {
                pivotDateTo = new Date(createdAtTo as string).toLocaleString('en-US', {
                  timeZone: 'America/Tijuana',
                });
              } else {
                pivotDateTo = new Date(createdAt as string).toLocaleString('en-US', {
                  timeZone: 'America/Tijuana',
                });
              }
            } catch (err) {
              throw new BadRequestException('The date format is invalid');
            }

            const dateClientFrom = new Date(new Date(pivotDate).setHours(0, 0, 0, 0));
            const dateClientTo = new Date(new Date(pivotDateTo).setHours(23, 59, 59, 999));

            const from = new Date(
              Date.UTC(
                dateClientFrom.getFullYear(),
                dateClientFrom.getMonth(),
                dateClientFrom.getDate(),
                dateClientFrom.getHours(),
                dateClientFrom.getMinutes(),
                dateClientFrom.getSeconds(),
                dateClientFrom.getMilliseconds(),
              ),
            );

            const to = new Date(
              Date.UTC(
                dateClientTo.getFullYear(),
                dateClientTo.getMonth(),
                dateClientTo.getDate(),
                dateClientTo.getHours(),
                dateClientTo.getMinutes(),
                dateClientTo.getSeconds(),
                dateClientTo.getMilliseconds(),
              ),
            );

            where[key] = {
              $gte: from,
              $lte: to,
            };
          } else {
            where[key] = filter.by[key];
          }
        });

        params.where = where;
      }
    }

    const [ecosystems, total] = await this.ecosystemRepository.findAndCount(params);

    const listEcosystem = new ListEcosystem(ecosystems, total);

    return listEcosystem;
  }

  async softDeleteBy(id: string): Promise<number | undefined> {
    const ecosystem = await this.byIdOrFail(id);
    ecosystem.disabled();

    const partialEntity = ecosystem.entityRootWithoutIdentifier();

    const result = await this.ecosystemRepository.update(new ObjectId(id), partialEntity);

    if (result.affected === 0) {
      throw new InternalServerErrorException('The ecosystem could not be deleted');
    }

    return result.affected;
  }
}
