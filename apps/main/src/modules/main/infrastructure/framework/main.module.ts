import { Module } from '@nestjs/common';
import { MainHealthServerModule } from '@app-main/modules/health/infrastructure/framework/main.module';
import { MainEcosystemServerModule } from '@module-eco/infrastructure/framework/ecosystem.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MongoType } from '@lib-commons/domain/contracts/types/var-environment-map/db/mongo.type';
import { DefaultNamingStrategy } from 'typeorm';
import { MainProjectServerModule } from '@module-project/infrastructure/framework/project.module';
import { MainModuleServerModule } from '@app-main/modules/module/infrastructure/framework/module.module';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure/config/options/config.options';
import { ConfigModule } from '@lib-commons/infrastructure/framework/common-main.module';
import { DatabasesLoader } from '@lib-commons/infrastructure/config/loaders/database.loader';

@Module({
  imports: [
    MainHealthServerModule,
    MainEcosystemServerModule,
    MainProjectServerModule,
    MainModuleServerModule,
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabasesLoader.mongo)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get<MongoType>('mongo') as MongoType;
        const namingStrategy = new DefaultNamingStrategy();

        return {
          type: db.type,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          // database: db.name,
          synchronize: true,
          autoLoadEntities: true,
          migrationsTableName: db.migrationsTableName,
          logging: true,
          legacySpatialSupport: false,
          ssl: false,
          entities: [process.cwd() + '/apps/main/src/modules/**/*-hades.entity.ts'],
          namingStrategy,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
  ],
})
export class MainModule {}
