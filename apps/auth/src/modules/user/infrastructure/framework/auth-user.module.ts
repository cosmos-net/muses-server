import { Module } from '@nestjs/common';
import { USER_REPOSITORY, CreateUserRootService, GetUserService } from '@app-auth/modules/user/application';
import { TypeOrmUserRepository, UserModuleFacade, UserEntity } from '@app-auth/modules/user/infrastructure';
import { TypeOrmModule } from '@nestjs/typeorm';

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
