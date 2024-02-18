import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ENCRYPTER_SERVICE, USER_REPOSITORY } from '@module-user/application/constants/injection-tokens';
import { ConfigService } from '@nestjs/config';
import { UserRootNotDefinedException } from '@module-user/domain/exceptions/user-root-not-defined.exception';
import { IEncrypterService } from '@module-user/domain/contracts/encrypter-service';
import { UserRootAlreadyDefinedException } from '@module-user/domain/exceptions/user-root-not-already-defined.exception';
import { ServerAuthType } from '@lib-commons/domain/contracts/types/var-environment-map/servers/server-auth.type';
import { UserRootType } from '@lib-commons/domain/contracts/types/var-environment-map/user-root/user-root.type';
import { IUserRepository } from '@module-user/domain/contracts/user-repository';
import { RolesEnum } from '@module-user/domain/roles.enum';
import { User } from '@module-user/domain/user';

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
