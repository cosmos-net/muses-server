import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ENCRYPTER_SERVICE, USER_REPOSITORY } from '@app-auth/modules/user/application/constants/injection-tokens';
import { UserRootType, ServerAuthType } from '@lib-commons/domain';
import { ConfigService } from '@nestjs/config';
import { RolesEnum, User, IUserRepository } from '@app-auth/modules/user/domain';
import { UserRootNotDefinedException } from '@module-user/domain/exceptions/user-root-not-defined.exception';
import { IEncrypterService } from '@module-user/domain/contracts/encrypter-service';
import { UserRootAlreadyDefinedException } from '@module-user/domain/exceptions/user-root-not-already-defined.exception';

@Injectable()
export class CreateUserRootService implements OnApplicationBootstrap {
  private logger = new Logger(CreateUserRootService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ENCRYPTER_SERVICE)
    private readonly encrypterService: IEncrypterService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const isUserRootInDb = await this.userRepository.findUserRoot();

      if (isUserRootInDb) {
        throw new UserRootAlreadyDefinedException();
      }

      const userRoot = this.config.get<UserRootType>('userRoot') as UserRootType;
      const isUserDefined = userRoot !== undefined;

      if (!isUserDefined) {
        throw new UserRootNotDefinedException();
      }

      const { email, username, password } = userRoot;
      const { hashSalt } = this.config.get<ServerAuthType>('auth') as ServerAuthType;

      const passwordEncrypter = await this.encrypterService.withHash(password, hashSalt);

      const user = new User();

      user.initializeCredentials(email, username, passwordEncrypter);
      user.enabled();
      user.withRoles([RolesEnum.root]);

      await this.userRepository.persist(user);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
