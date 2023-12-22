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

        console.log(db);

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
          logging: true,
          legacySpatialSupport: false,
          ssl: false,
          entities: [process.cwd + '/apps/main/src/modules/'],
        } as TypeOrmModuleAsyncOptions;
      },
    }),
  ],
})
export class MainModule {}
