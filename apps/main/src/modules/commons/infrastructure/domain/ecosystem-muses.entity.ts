import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IEcosystemSchema } from '@app-main/modules/commons/domain';
import { BaseEntity } from '@lib-commons/infrastructure';
import { ObjectId } from 'mongodb';

@Entity({ name: 'ecosystem' })
export class EcosystemEntity extends BaseEntity implements IEcosystemSchema {
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
}
