import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '@management-auth/modules/user/application/use-cases/get-user/constants/injection-tokens';
import { GetUserService } from '@management-auth/modules/user/application/use-cases/get-user/get-user.service';
import { TypeOrmUserRepository } from '@management-auth/modules/user/infrastructure/repositories/typeorm-user.repository';
import { UserModuleFacade } from '@management-auth/modules/user/infrastructure/api-facade/user-module.facade';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@management-auth/modules/user/infrastructure/domain/user.entity';
import { CreateUserRootService } from '@management-auth/modules/user/application/use-cases/create-user-root/create-user-root.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [
    GetUserService,
    UserModuleFacade,
    CreateUserRootService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserModuleFacade],
})
export class AuthUserModule {}
