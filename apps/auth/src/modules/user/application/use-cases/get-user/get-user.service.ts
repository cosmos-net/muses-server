import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '@app-auth/modules/user/application/constants/injection-tokens';
import { GetUserQuery } from '@app-auth/modules/user/application';
import { IUserRepository, User } from '@app-auth/modules/user/domain';

@Injectable()
export class GetUserService implements IApplicationServiceQuery<GetUserQuery> {
  constructor(@Inject(USER_REPOSITORY) private userRepository: IUserRepository) {}

  process<T extends GetUserQuery>(query: T): Promise<User> {
    const { email } = query;

    const user = this.userRepository.getByEmailOrFail(email);

    return user;
  }
}
