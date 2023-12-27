import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ValidatePasswordService,
  CreateUserRootService,
  GetUserService,
  USER_REPOSITORY,
} from '@module-user/application';
import {
  PasswordValidationController,
  UserEntity,
  UserModuleFacade,
  TypeOrmUserRepository,
} from '@module-user/infrastructure';

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
  ],
  exports: [UserModuleFacade],
})
export class AuthUserModule {}
