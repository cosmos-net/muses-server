import { ConfigModule, DatabasesLoader } from '@lib-commons/infrastructure';
import { Module } from '@nestjs/common';
import { MainConfigOptions, AuthModuleFacade } from '@app-auth/modules/main/infrastructure';
import { AuthUserModule } from '@app-auth/modules/user/infrastructure';
import { AuthAuthenticationModule } from '@app-auth/modules/authentication/infrastructure';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PostgresType } from '@lib-commons/domain';

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
