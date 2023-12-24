import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IEcosystemSchema } from '@app-main/modules/commons/domain';
import { BaseEntity } from '@lib-commons/infrastructure';

@Entity({ name: 'ecosystem' })
export class EcosystemEntity extends BaseEntity implements IEcosystemSchema {
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
    name: 'is_enabled',
    nullable: false,
  })
  enabled: boolean;
}
