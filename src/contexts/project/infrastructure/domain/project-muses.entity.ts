import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';
import { BaseEntity } from '@core/infrastructure/domain/base-commons.entity';
import { IProjectSchema } from '@module-project/domain/aggregate/project.schema';
@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity implements IProjectSchema {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  id: string;

  @Column({
    unique: true,
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'string',
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'boolean',
    name: 'isEnabled',
    nullable: false,
  })
  isEnabled: boolean;

  @Column({
    type: 'string',
    name: 'ecosystem',
    nullable: false,
  })
  ecosystem: ObjectId;

  @Column({
    type: 'array',
    name: 'modules',
    nullable: true,
  })
  modules?: ObjectId[] | null;
}
