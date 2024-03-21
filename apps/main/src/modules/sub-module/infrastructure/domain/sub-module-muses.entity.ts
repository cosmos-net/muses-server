import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';
import { BaseEntity } from '@lib-commons/infrastructure/domain/base-commons.entity';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';

@Entity({ name: 'sub-module' })
export class SubModuleEntity extends BaseEntity implements ISubModuleSchema {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  id: string;

  @Column({
    unique: true,
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
    name: 'module',
    nullable: false,
    type: 'varchar',
  })
  module: ObjectId;

  @Column({
    name: 'actions',
    nullable: true,
    type: 'varchar',
  })
  actions: ObjectId[];
}
