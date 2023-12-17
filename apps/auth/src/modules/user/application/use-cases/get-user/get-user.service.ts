import { IApplicationServiceQuery } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { GetUserQuery, USER_REPOSITORY } from '@app-auth/modules/user/application';
import { IUserRepository } from '@app-auth/modules/user/domain';
import { User } from '@app-auth/modules/user/domain/user';

@Injectable()
export class GetUserService implements IApplicationServiceQuery<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  process<T extends GetUserQuery>(query: T): Promise<User> {
    const { email } = query;

    const user = this.userRepository.getByEmailOrFail(email);

    return user;
  }
}
