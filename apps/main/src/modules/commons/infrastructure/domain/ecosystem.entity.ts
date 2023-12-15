import { BaseEntity, Column, Entity, Index, ObjectId, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import IEcosystemSchema from '@management-main/modules/commons/domain/ecosystem.interface';

@Entity({ name: 'Ecosystem' })
export class EcosystemEntity extends BaseEntity implements IEcosystemSchema {

  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
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
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'is_enabled',
    nullable: false,
  })
  enabled: boolean;
}
