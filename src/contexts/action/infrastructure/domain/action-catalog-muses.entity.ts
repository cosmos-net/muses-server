import { BaseEntity } from '@core/infrastructure/domain/base-commons.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { IActionCatalogSchema } from '@module-action/domain/aggregate/action-catalog';

@Entity({ name: 'action-catalog' })
export class ActionCatalogEntity extends BaseEntity implements IActionCatalogSchema {
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
}
