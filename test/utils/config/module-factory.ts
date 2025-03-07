/* eslint-disable hexagonal-architecture/enforce */

import { ConfigModule } from '@core/infrastructure/framework/common-main.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DefaultNamingStrategy } from 'typeorm';
import { entities } from '@test/utils/entities';
import { MainProjectModule } from '@module-project/infrastructure/framework/project.module';
import { MainEcosystemModule } from '@module-eco/infrastructure/framework/ecosystem.module';
import { MongoTestConfigOptions } from './mongo-test-config-options';
import { MongoTestType } from './mongo-test.type';
import { mongo_test_loader } from './mongo-test.loader';
import { MainModuleModule } from '@module-module/infrastructure/framework/module.module';
import { MainSubModuleModule } from '@module-sub-module/infrastructure/framework/sub-module.module';
import { MainActionModule } from '@module-action/infrastructure/framework/action.module';
import { MainResourceModule } from '@module-resource/infrastructure/framework/resource.module';

export class ModuleFactory {
  public static async createModule(): Promise<TestingModule> {
    return Test.createTestingModule({
      imports: [
        MainEcosystemModule,
        MainProjectModule,
        MainModuleModule,
        MainSubModuleModule,
        MainActionModule,
        MainResourceModule,
        ConfigModule.forRoot(MongoTestConfigOptions),
        ConfigModule.forRoot({
          envFilePath: '.test-local.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(mongo_test_loader)],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const db = configService.get<MongoTestType>('mongo_test') as MongoTestType;

            if (db === undefined) throw new Error(`MongoType ${db} is not available`);

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
              entities,
              namingStrategy,
            } as TypeOrmModuleAsyncOptions;
          },
        }),
      ],
    }).compile();
  }
}
