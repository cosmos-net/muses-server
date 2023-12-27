import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@app-auth/modules/user/application/constants/injection-tokens';
import { GetUserService } from '@app-auth/modules/user/application/use-cases/get-user/get-user.service';
import { TypeOrmUserRepository } from '@app-auth/modules/user/infrastructure/repositories/typeorm-user.repository';
import { UserModuleFacade } from '@app-auth/modules/user/infrastructure/api-facade/user-module.facade';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app-auth/modules/user/infrastructure/domain/user-hades.entity';
import { CreateUserRootService } from '@app-auth/modules/user/application/use-cases/create-user-root/create-user-root.service';
// import { ValidatePasswordService } from '@module-user/application';
import { ValidatePasswordService } from '@module-user/application/use-cases/validate-password/validate-password.service';
import { PasswordValidationController } from '../controllers/password-validation/validate.password.controller';

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
