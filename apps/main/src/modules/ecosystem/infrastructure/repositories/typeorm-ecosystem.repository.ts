import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, MongoRepository } from 'typeorm';
import { Ecosystem } from '@module-eco/domain/aggregate/ecosystem';
import { ListEcosystem } from '@module-eco/domain/list-ecosystem';
import { ObjectId } from 'mongodb';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { TypeormRepository } from '@lib-commons/infrastructure/domain/typeorm/typeorm-repository';
import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';
import { IPaginationOrder } from '@lib-commons/domain/list/pagination-order-filter';

@Injectable()
export class TypeOrmEcosystemRepository extends TypeormRepository<EcosystemEntity> implements IEcosystemRepository {
  constructor(
    @InjectRepository(EcosystemEntity)
    private readonly ecosystemRepository: MongoRepository<EcosystemEntity>,
  ) {
    super();
  }

  async persist(model: Ecosystem): Promise<void> {
    let partialSchema: Partial<IEcosystemSchema & EcosystemEntity> = model.partialEcosystemSchema();

    if (partialSchema.id) {
      const { id, ...restParams } = partialSchema;
      const objectId = new ObjectId(id);

      partialSchema = {
        ...restParams,
        _id: objectId,
        id: objectId,
      };
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

  async byIdOrFail(id: string): Promise<Ecosystem> {
    const ecosystem = await this.ecosystemRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: true,
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

  async softDeleteBy(id: string): Promise<number | undefined> {
    const ecosystem = await this.byIdOrFail(id);
    ecosystem.disable();

    const partialEntity = ecosystem.entityRootWithoutIdentifier();

    const result = await this.ecosystemRepository.update(new ObjectId(id), partialEntity);

    if (result.affected === 0) {
      throw new InternalServerErrorException('The ecosystem could not be deleted');
    }

    return result.affected;
  }

  async matching(criteria: Criteria): Promise<ListEcosystem> {
    const query = this.getQueryByCriteria(criteria);

    const [ecosystems, total] = await this.ecosystemRepository.findAndCount(query);

    const listEcosystem = new ListEcosystem(ecosystems, total);

    return listEcosystem;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const result = await this.ecosystemRepository.findOneBy({ name });

    return !result;
  }
}
