import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { USER_REPOSITORY } from '@app-auth/modules/user/application/constants/injection-tokens';
import { UserRootType, ServerAuthType } from '@lib-commons/domain';
import { ConfigService } from '@nestjs/config';
import { RolesEnum, User, IUserRepository } from '@app-auth/modules/user/domain';

@Injectable()
export class CreateUserRootService implements OnApplicationBootstrap {
  private logger = new Logger(CreateUserRootService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const userRoot = this.config.get<UserRootType>('userRoot') as UserRootType;

      if (!userRoot) {
        throw new Error('User root not defined in config file');
      }

      const serverAuth = this.config.get<ServerAuthType>('auth') as ServerAuthType;

      if (!serverAuth) {
        throw new Error('Server auth not defined in config file');
      }

      const existsUserRoot = await this.userRepository.findUserRoot();

      if (existsUserRoot) {
        throw new Error('User root already exists');
      }

      const { email, username, password } = userRoot;
      const user = new User();

      user.initializeCredentials(email, username, password);
      await user.encryptPassword(serverAuth.hashSalt);

      user.enabled();
      user.withRoles([RolesEnum.root]);

      await this.userRepository.persist(user);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
