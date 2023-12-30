import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ValidatePasswordService,
  CreateUserRootService,
  GetUserService,
  USER_REPOSITORY,
  JSON_WEB_TOKEN_SERVICE,
} from '@module-user/application';
import {
  PasswordValidationController,
  UserEntity,
  UserModuleFacade,
  TypeOrmUserRepository,
} from '@module-user/infrastructure';
import { JsonWebTokenService } from '@app-auth/modules/common/infrastructure/domain/json-web-token.service';

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
  ],
  exports: [UserModuleFacade],
})
export class AuthUserModule {}
