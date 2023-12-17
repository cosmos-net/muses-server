import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { IUserRepository, User, RolesEnum } from '@app-auth/modules/user/domain';
import { USER_REPOSITORY } from '@app-auth/modules/user/application';
import { UserRootType, ServerAuthType } from '@lib-commons/domain';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateUserRootService implements OnApplicationBootstrap {
  private logger = new Logger(CreateUserRootService.name);

  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private readonly config: ConfigService,
  ) {}

  // TODO: Validate if user root already exists or change persist to method upsert
  // TODO: To level business logic an user root should be created only once and only exists one user root
  async onApplicationBootstrap(): Promise<void> {
    try {
      const userRoot = this.config.get<UserRootType>(
        'userRoot',
      ) as UserRootType;

      if (!userRoot) {
        throw new Error('User root not found');
      }

      const serverAuth = this.config.get<ServerAuthType>(
        'auth',
      ) as ServerAuthType;

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
