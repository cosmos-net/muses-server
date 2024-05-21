import { BaseEntity } from '@core/infrastructure/domain/base-commons.entity';
import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';
import { IResourceSchema } from '@module-resource/domain/aggregate/resource.schema';
import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';

@Entity({ name: 'resource' })
export class ResourceEntity extends BaseEntity implements IResourceSchema {
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
    name: 'endpoint',
    nullable: false,
  })
  endpoint: string;

  @Column({
    type: 'enum',
    enum: EnumMethodValue,
    name: 'method',
    nullable: false,
  })
  method: EnumMethodValue;

  @Column({
    type: 'array',
    name: 'triggers',
    nullable: true,
  })
  triggers?: ObjectId[] | null;

  @Column({
    type: 'array',
    name: 'actions',
    nullable: false,
  })
  actions: ObjectId[] | null;
}
