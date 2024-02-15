import { Column, Entity, JoinColumn, ObjectIdColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@lib-commons/infrastructure';
import { ObjectId } from 'mongodb';
import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { IProjectSchema } from '@module-project/domain/aggregate/project';

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

  @OneToMany(() => ProjectEntity, (project) => project.ecosystem)
  projects: ProjectEntity[];
}
