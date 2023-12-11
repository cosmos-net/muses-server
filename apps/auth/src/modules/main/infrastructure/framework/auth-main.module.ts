import { ConfigModule } from '@management-commons/infrastructure/framework/common-main.module';
import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@management-auth/modules/main/infrastructure/config/options/config.options';
import { AuthModuleFacade } from '@management-auth/modules/main/infrastructure/api-facade/auth-module.facade';
import { AuthUserModule } from '@management-auth/modules/user/infrastructure/framework/auth-user.module';
import { AuthAuthenticationModule } from '@management-auth/modules/authentication/infrastructure/framework/auth-authentication.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DatabasesLoader } from '@management-commons/infrastructure/config/loaders/database.loader';
import { ConfigService } from '@nestjs/config';
import { PostgresType } from '@management-commons/domain/contracts/types/var-environment-map/db/postgres.type';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabasesLoader.postgres)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get<PostgresType>('postgres') as PostgresType;

        if (db === undefined) throw new Error('Configuration Error');

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
          cli: {
            migrationsDir: 'db/postgres/migration',
          },
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
