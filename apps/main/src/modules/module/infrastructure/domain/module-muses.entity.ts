import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';
import { BaseEntity } from '@lib-commons/infrastructure/domain/base-commons.entity';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';

@Entity({ name: 'module' })
export class ModuleEntity extends BaseEntity implements IModuleSchema {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
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
    name: 'project',
    nullable: false,
    type: 'varchar',
  })
  project: ObjectId;

  @Column({
    name: 'subModules',
    nullable: true,
    type: 'array',
  })
  subModules: ObjectId[];
}
