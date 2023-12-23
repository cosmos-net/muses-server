import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@app-auth/modules/user/domain/contracts/user-repository';
import { UserEntity } from '@app-auth/modules/user/infrastructure/domain/user-hades.entity';
import { User } from '@app-auth/modules/user/domain/user';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getByEmailOrFail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new User(user);
  }

  async persist(user: User): Promise<void> {
    await this.userRepository.save(user.entityRoot());
  }
}
