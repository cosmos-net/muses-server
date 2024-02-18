import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IUserRepository } from '@module-user/domain/contracts/user-repository';
import { UserEntity } from '@module-user/infrastructure/domain/user-hades.entity';
import { User } from '@module-user/domain/user';
import { RolesEnum } from '@module-user/domain/roles.enum';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getByEmailOrUsernameOrFail(emailOrUsername: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      throw new NotFoundException(`User with email or username ${emailOrUsername} not found`);
    }

    return new User(user);
  }

  async persist(user: User): Promise<void> {
    await this.userRepository.save(user.entityRoot());
  }

  async findUserRoot(): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { roles: In[RolesEnum.root] },
    });

    if (!user) {
      return null;
    }

    return new User(user);
  }
}
