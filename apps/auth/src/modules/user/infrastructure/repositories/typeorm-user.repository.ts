import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository, User } from '@app-auth/modules/user/domain';
import { UserEntity } from '@app-auth/modules/user/infrastructure';

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
