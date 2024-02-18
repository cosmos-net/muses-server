import { Column, Entity, ManyToOne, ObjectIdColumn, ObjectId } from 'typeorm';
import { BaseEntity } from '@lib-commons/infrastructure';
import { IModuleSchema } from '@module-module/domain/aggregate/module';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';

@Entity({ name: 'module' })
export class ModuleEntity extends BaseEntity implements IModuleSchema {
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
