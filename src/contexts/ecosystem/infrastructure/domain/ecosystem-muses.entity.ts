import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from '@core/infrastructure/domain/base-commons.entity';
import { ObjectId } from 'mongodb';
import { IEcosystemSchema } from '@context-ecosystem/domain/aggregate/ecosystem.schema';

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

  @Column({
    name: 'projects',
    nullable: true,
  })
  projects: ObjectId[];
}
