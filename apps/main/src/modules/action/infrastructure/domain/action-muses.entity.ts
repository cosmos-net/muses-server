import { BaseEntity } from '@lib-commons/infrastructure/domain/base-commons.entity';
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
    name: 'modules',
    nullable: true,
    type: 'array',
  })
  modules: ObjectId[];

  @Column({
    name: 'subModules',
    nullable: true,
    type: 'array',
  })
  subModules: ObjectId[];
}
