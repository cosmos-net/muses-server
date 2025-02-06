import { TypeormRepository } from '@core/infrastructure/domain/typeorm/typeorm-repository';
import { Injectable } from '@nestjs/common';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Action } from '@module-action/domain/aggregate/action';
import { ListAction } from '@module-action/domain/aggregate/list-action';
import { Criteria } from '@core/domain/criteria/criteria';
import { IActionSchema } from '@module-action/domain/aggregate/action.schema';

@Injectable()
export class TypeOrmActionRepository extends TypeormRepository<ActionEntity> implements IActionRepository {
  constructor(
    @InjectRepository(ActionEntity)
    private readonly actionRepository: MongoRepository<ActionEntity>,
  ) {
    super();
  }

  async searchOneBy(id: string, options: { withDeleted: false }): Promise<Action | null> {
    const actionFound = await this.actionRepository.findOne({
      where: { _id: new ObjectId(id) },
      withDeleted: options.withDeleted,
    });

    if (!actionFound) {
      return null;
    }

    const action = new Action({
      ...actionFound,
      ...(actionFound.submodule && { submodule: actionFound.submodule.toHexString() }),
      ...(actionFound.resource && { resource: actionFound.resource.toHexString() }),
      actionCatalog: actionFound.actionCatalog.toHexString(),
      id: actionFound._id.toHexString(),
    });

    return action;
  }

  async isNameAvailable(name: string): Promise<boolean> {
    const actionFound = await this.actionRepository.findOne({ where: { name }, withDeleted: true });

    return !actionFound;
  }

  async persist(model: Action): Promise<Action> {
    let partialSchema: Partial<IActionSchema & ActionEntity> = model.entityRootPartial();

    const module = ObjectId.createFromHexString(typeof partialSchema.module === 'object' ? partialSchema.module.id : partialSchema.module);

    partialSchema = {
      ...partialSchema,
      module,
    };

    if (partialSchema.submodule) {
      const submodule = ObjectId.createFromHexString(typeof partialSchema.submodule === 'object' ? partialSchema.submodule.id : partialSchema.submodule);

      partialSchema = {
        ...partialSchema,
        submodule,
      };
    }

    if (partialSchema.resource) {
      const resource = ObjectId.createFromHexString(typeof partialSchema.resource === 'object' ? partialSchema.resource.id : partialSchema.resource);

      partialSchema = {
        ...partialSchema,
        resource,
      };
    }

    if (partialSchema.actionCatalog) {
      const actionCatalog = ObjectId.createFromHexString(typeof partialSchema.actionCatalog === 'object' ? partialSchema.actionCatalog.id : partialSchema.actionCatalog);

      partialSchema = {
        ...partialSchema,
        actionCatalog,
      };
    }

    if (partialSchema.id) {
      const _id = ObjectId.createFromHexString(partialSchema.id);

      const action = (await this.actionRepository.findOneAndReplace(
        { _id },
        {
          ...partialSchema,
          updatedAt: new Date(),
        },
        {
          returnDocument: 'after',
        },
      )) as ActionEntity;

      model.hydrate({
        ...action,
        ...(action.module && { module: action.module.toHexString() }),
        ...(action.submodule && { submodule: action.submodule.toHexString() }),
        ...(action.resource && { resource: action.resource.toHexString() }),
        actionCatalog: action.actionCatalog.toHexString(),
        id: action._id.toHexString(),
      });

      return model;
    }

    const action = await this.actionRepository.save(partialSchema);

    model.hydrate({
      ...action,
      ...(action.module && { module: action.module.toHexString() }),
      ...(action.submodule && { submodule: action.submodule.toHexString() }),
      ...(action.resource && { resource: action.resource.toHexString() }),
      actionCatalog: action.actionCatalog.toHexString(),
      id: action._id.toHexString(),
    });

    return model;
  }

  async searchListBy(criteria: Criteria): Promise<ListAction> {
    const query = this.getQueryByCriteria(criteria);

    const [actions, total] = await this.actionRepository.findAndCount(query);

    const actionsMapped = actions.map((action) => ({
      ...action,
      ...(action.module && { module: action.module.toHexString() }),
      ...(action.submodule && { submodule: action.submodule.toHexString() }),
      ...(action.resource && { resource: action.resource.toHexString() }),
      actionCatalog: action.actionCatalog.toHexString(),
      id: action._id.toHexString(),
    }));

    const list = new ListAction(actionsMapped, total);
    return list;
  }

  async searchListByIds(ids: string[], options: { withDeleted: boolean }): Promise<ListAction> {
    const actions = await this.actionRepository.find({
      where: { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      withDeleted: options.withDeleted,
    });

    const actionsMapped = actions.map((action) => ({
      ...action,
      ...(action.module && { module: action.module.toHexString() }),
      ...(action.submodule && { submodule: action.submodule.toHexString() }),
      ...(action.resource && { resource: action.resource.toHexString() }),
      actionCatalog: action.actionCatalog.toHexString(),
      id: action._id.toHexString(),
    }));

    const list = new ListAction(actionsMapped, actionsMapped.length);

    return list;
  }
}
