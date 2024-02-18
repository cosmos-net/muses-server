import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JsonWebTokenService } from '@app-auth/modules/common/infrastructure/domain/json-web-token.service';
import { EncrypterService } from '@module-user/infrastructure/domain/services/encrypter.service';
import {
  USER_REPOSITORY,
  JSON_WEB_TOKEN_SERVICE,
  ENCRYPTER_SERVICE,
} from '@module-user/application/constants/injection-tokens';
import { CreateUserRootService } from '@module-user/application/use-cases/create-user-root/create-user-root.service';
import { GetUserService } from '@module-user/application/use-cases/get-user/get-user.service';
import { ValidatePasswordService } from '@module-user/application/use-cases/validate-password/validate-password.service';
import { UserModuleFacade } from '@module-user/infrastructure/api-facade/user-module.facade';
import { PasswordValidationController } from '@module-user/infrastructure/controllers/password-validation/validate.password.controller';
import { UserEntity } from '@module-user/infrastructure/domain/user-hades.entity';
import { TypeOrmUserRepository } from '@module-user/infrastructure/repositories/typeorm-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [PasswordValidationController],
  providers: [
    GetUserService,
    UserModuleFacade,
    CreateUserRootService,
    ValidatePasswordService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: JSON_WEB_TOKEN_SERVICE,
      useClass: JsonWebTokenService,
    },
    {
      provide: ENCRYPTER_SERVICE,
      useClass: EncrypterService,
    },
  ],
  exports: [UserModuleFacade],
})
export class AuthUserModule {}
