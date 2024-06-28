import { TypeormRepository } from '@core/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';
import { ActionCatalog } from '@module-action/domain/aggregate/action-catalog';
import { ListActionCatalog } from '@module-action/domain/aggregate/list-action-catalog';
import { ActionCatalogEntity } from '@module-action/infrastructure/domain/action-catalog-muses.entity';
import { isObjectIdHex } from '@core/domain/helpers/utils';

@Injectable()
export class TypeOrmActionCatalogRepository extends TypeormRepository<ActionCatalogEntity> implements IActionCatalogRepository {
  constructor(
    @InjectRepository(ActionCatalogEntity)
    private readonly actionCatalogEntity: MongoRepository<ActionCatalogEntity>,
  ) {
    super();
  }

  async persist(model: ActionCatalog): Promise<ActionCatalog> {
    const entityRoot = model.entityRoot();

    const actionCatalog = await this.actionCatalogEntity.save(entityRoot);

    model.hydrate({
      ...actionCatalog,
      id: actionCatalog._id.toHexString(),
    });

    return model;
  }

  async oneBy(idOrName: string): Promise<ActionCatalog | null> {
    const isObjectHex = isObjectIdHex(idOrName);

    const actionCatalog = await this.actionCatalogEntity.findOne({
      where: isObjectHex ? { _id: new ObjectId(idOrName) } : { name: idOrName },
    });

    if (!actionCatalog) {
      return null;
    }

    return new ActionCatalog({
      ...actionCatalog,
      id: actionCatalog._id.toHexString(),
    });
  }

  async list(): Promise<ListActionCatalog> {
    const actionCatalog = await this.actionCatalogEntity.find();
    
    const listAction = new ListActionCatalog(actionCatalog, actionCatalog.length);

    return listAction;
  }
}
