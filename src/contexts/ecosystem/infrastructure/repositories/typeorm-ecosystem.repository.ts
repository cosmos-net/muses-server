import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, MongoRepository } from 'typeorm';
import { Ecosystem } from '@context-ecosystem/domain/aggregate/ecosystem';
import { ListEcosystem } from '@context-ecosystem/domain/list-ecosystem';
import { ObjectId } from 'mongodb';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';
import { IEcosystemRepository } from '@context-ecosystem/domain/contracts/ecosystem-repository';
import { EcosystemEntity } from '@context-ecosystem/infrastructure/domain/ecosystem-muses.entity';
import { Criteria } from '@core/domain/criteria/criteria';
import { TypeormRepository } from '@core/infrastructure/domain/typeorm/typeorm-repository';
import { IEcosystemSchema } from '@context-ecosystem/domain/aggregate/ecosystem.schema';
import { IPaginationOrder } from '@core/domain/list/pagination-order-filter';

@Injectable()
export class TypeOrmEcosystemRepository extends TypeormRepository<EcosystemEntity> implements IEcosystemRepository {
  constructor(
    @InjectRepository(EcosystemEntity)
    private readonly ecosystemRepository: MongoRepository<EcosystemEntity>,
  ) {
    super();
  }

  async persist(model: Ecosystem): Promise<void> {
    const partialSchema: Partial<IEcosystemSchema & EcosystemEntity> = model.partialSchema();

    if (partialSchema.id) {
      const { id, ...restParams } = partialSchema;
      const _id = new ObjectId(id);

      const ecosystem = (await this.ecosystemRepository.findOneAndReplace(
        { _id },
        { ...restParams, updatedAt: new Date() },
        {
          returnDocument: 'after',
        },
      )) as EcosystemEntity;

      if (!ecosystem) {
        throw new BadRequestException('The ecosystem does not exist');
      }

      model.fromPrimitives({
        ...ecosystem,
        id: ecosystem._id.toHexString(),
      });

      return;
    }

    const ecosystem = await this.ecosystemRepository.save(partialSchema);

    model.fromPrimitives({
      ...ecosystem,
      id: ecosystem._id.toHexString(),
    });
  }

  async byNameOrFail(name: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOneBy({ name });

    if (!ecosystem) {
      throw new BadRequestException('The ecosystem does not exist');
    }

    const model = new Ecosystem({
      ...ecosystem,
      id: ecosystem._id.toHexString(),
    });

    return model;
  }

  async byIdOrFail(id: string, withDeleted: boolean): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted,
    });

    if (!ecosystem) {
      throw new BadRequestException('The ecosystem does not exist');
    }

    const model = new Ecosystem({
      ...ecosystem,
      id: ecosystem._id.toHexString(),
    });

    return model;
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

  async matching(criteria: Criteria): Promise<ListEcosystem> {
    const query = this.getQueryByCriteria(criteria);

    const [ecosystems, total] = await this.ecosystemRepository.findAndCount(query);

    const listEcosystem = new ListEcosystem(ecosystems, total);

    return listEcosystem;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const result = await this.ecosystemRepository.findOne({ where: { name }, withDeleted: true });

    return !result;
  }
}
