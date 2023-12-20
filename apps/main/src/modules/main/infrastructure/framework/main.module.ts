import { ConfigModule, DatabasesLoader } from '@lib-commons/infrastructure';
import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { MainHealthServerModule } from '@app-main/modules/health/infrastructure';
import { MainEcosystemServerModule } from '@app-main/modules/ecosystem/infrastructure';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MongoType } from '@lib-commons/domain';

@Module({
  imports: [
    MainHealthServerModule,
    MainEcosystemServerModule,
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabasesLoader.postgres)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get<MongoType>('mongo') as MongoType;

        if (db === undefined) throw new Error('Configuration Error');

        console.log('db', db);

        return {
          type: db.type,
          host: db.host,
          port: db.port,
          database: db.name,
          synchronize: true,
          autoLoadEntities: db.autoLoadEntities,
          migrationsTableName: db.migrationsTableName,
          logging: db.logging,
          legacySpatialSupport: false,
          ssl: db.tls,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
  ],
})
export class MainModule {}
