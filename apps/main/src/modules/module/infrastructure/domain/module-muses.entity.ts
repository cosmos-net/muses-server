import { Column, Entity, ManyToOne, ObjectIdColumn, ObjectId, Index } from 'typeorm';
import { BaseEntity } from '@lib-commons/infrastructure/domain/base-commons.entity';
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';

@Entity({ name: 'module' })
export class ModuleEntity extends BaseEntity implements IModuleSchema {
  @Column({ generated: 'uuid', unique: true, name: 'uuid' })
  uuid: string;

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
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'isEnabled',
    nullable: false,
  })
  isEnabled: boolean;

  @ManyToOne(() => ProjectEntity, (project) => project.modules)
  @Column()
  project: ObjectId;
}
