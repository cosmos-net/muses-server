import { Column, Entity, ManyToOne, ObjectIdColumn, ObjectId, OneToMany } from 'typeorm';
import { BaseEntity } from '@lib-commons/infrastructure';
import { IProjectSchema } from '@module-project/domain/aggregate/project';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
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
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'isEnabled',
    nullable: false,
  })
  isEnabled: boolean;

  // @ManyToOne(() => EcosystemEntity, (ecosystem) => ecosystem.project)
  // @ObjectIdColumn()
  // ecosystem: EcosystemEntity | ObjectId;

  @ManyToOne(() => EcosystemEntity, (ecosystem) => ecosystem.projects)
  @Column()
  ecosystem: ObjectId;

  @OneToMany(() => ModuleEntity, (module) => module.project)
  modules: ModuleEntity[];

  // This field gets created automatically by TypeORM
  // in the document. We need to add it here in order to
  // access it in our code.
  // @Column()
  // ecosystemId?: string;
}
