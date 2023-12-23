import { Module } from '@nestjs/common';
import { USER_REPOSITORY, GetUserService, CreateUserRootService, ValidatePasswordService } from '@app-auth/modules/user/application';
import { TypeOrmUserRepository, UserModuleFacade, UserEntity, PasswordValidationController } from '@app-auth/modules/user/infrastructure';
import { TypeOrmModule } from '@nestjs/typeorm';

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
