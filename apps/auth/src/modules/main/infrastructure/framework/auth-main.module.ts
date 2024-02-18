import { Module } from '@nestjs/common';
import { AuthUserModule } from '@module-user/infrastructure/framework/auth-user.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthAuthenticationModule } from '@module-auth/infrastructure/framework/auth-authentication.module';
import { PostgresType } from '@lib-commons/domain/contracts/types/var-environment-map/db/postgres.type';
import { DatabasesLoader } from '@lib-commons/infrastructure/config/loaders/database.loader';
import { AuthModuleFacade } from '@app-auth/modules/main/infrastructure/api-facade/auth-module.facade';
import { MainConfigOptions } from '@app-auth/modules/main/infrastructure/config/options/config.options';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabasesLoader.postgres)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get<PostgresType>('postgres') as PostgresType;

        return {
          type: db.type,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          synchronize: db.synchronize,
          autoLoadEntities: db.autoLoadEntities,
          migrationsTableName: db.migrationsTableName,
          logging: db.logging,
          legacySpatialSupport: false,
          ssl: db.tls,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    AuthAuthenticationModule,
    AuthUserModule,
  ],
  providers: [AuthModuleFacade],
  exports: [AuthModuleFacade],
})
export class AuthMainModule {}
