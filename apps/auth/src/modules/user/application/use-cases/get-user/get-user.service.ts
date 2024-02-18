import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '@module-user/application/constants/injection-tokens';
import { GetUserQuery } from '@module-user/application/use-cases/get-user/get-user.query';
import { IUserRepository } from '@module-user/domain/contracts/user-repository';
import { User } from '@module-user/domain/user';

@Injectable()
export class GetUserService implements IApplicationServiceQuery<GetUserQuery> {
  constructor(@Inject(USER_REPOSITORY) private userRepository: IUserRepository) {}

  process<T extends GetUserQuery>(query: T): Promise<User> {
    const { emailOrUsername } = query;

    const user = this.userRepository.getByEmailOrUsernameOrFail(emailOrUsername);

    return user;
  }
}
