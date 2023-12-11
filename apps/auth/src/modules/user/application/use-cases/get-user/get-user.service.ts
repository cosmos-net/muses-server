import { IApplicationServiceQuery } from '@management-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetUserQuery } from '@management-auth/modules/user/application/use-cases/get-user/get-user.query';
import { IUserRepository } from '@management-auth/modules/user/domain/contracts/user-repository';
import { USER_REPOSITORY } from '@management-auth/modules/user/application/use-cases/get-user/constants/injection-tokens';
import { User } from '@management-auth/modules/user/domain/user';

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
