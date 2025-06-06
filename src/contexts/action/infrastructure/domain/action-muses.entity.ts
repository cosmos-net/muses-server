import { BaseEntity } from '@core/infrastructure/domain/base-commons.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { IActionSchema } from '@module-action/domain/aggregate/action.schema';

@Entity({ name: 'action' })
export class ActionEntity extends BaseEntity implements IActionSchema {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn({
    generated: true,
  })
  id: string;

  @Column({
    name: 'name',
    nullable: false,
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'description',
    nullable: false,
    type: 'varchar',
  })
  description: string;

  @Column({
    name: 'isEnabled',
    nullable: false,
    type: 'boolean',
  })
  isEnabled: boolean;

  @Column({
    name: 'resource',
    nullable: true,
    type: 'varchar',
  })
  resource: ObjectId;

  @Column({
    name: 'module',
    nullable: false,
    type: 'varchar',
  })
  module: ObjectId;

  @Column({
    name: 'submodule',
    nullable: true,
    type: 'varchar',
  })
  submodule?: ObjectId;

  @Column({
    name: 'actionCatalog',
    nullable: false,
    type: 'varchar',
  })
  actionCatalog: ObjectId;
}
