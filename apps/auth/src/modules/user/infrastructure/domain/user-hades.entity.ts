import { BaseEntity } from '@lib-commons/infrastructure/domain/base.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IUserSchema, RolesEnum } from '@app-auth/modules/user/domain';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUserSchema {
  @PrimaryGeneratedColumn('identity', { name: 'id' })
  public id: number;

  @Index()
  @Column({
    generated: 'uuid',
    unique: true,
    name: 'uuid',
  })
  uuid: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'username',
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    name: 'enabled',
    nullable: false,
  })
  enabled: boolean;

  @Column({
    name: 'roles',
    type: 'enum',
    enum: RolesEnum,
    enumName: 'roles_enum',
    nullable: false,
    array: true,
  })
  roles: RolesEnum[];
}
