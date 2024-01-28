import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IProjectSchema } from '@app-main/modules/commons/domain';
import { BaseEntity } from '@lib-commons/infrastructure';
import { ObjectId } from 'mongodb';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity implements IProjectSchema {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  id: string;

  @Column({
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'isEnabled',
    nullable: false,
  })
  isEnabled: boolean;

  @Column({
    name: 'ecosystem',
    nullable: false,
  })
  ecosystem: string;
}
