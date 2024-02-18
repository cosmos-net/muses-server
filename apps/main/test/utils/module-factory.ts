/* eslint-disable hexagonal-architecture/enforce */

import { ConfigModule } from '@lib-commons/infrastructure/framework/common-main.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DefaultNamingStrategy } from 'typeorm';
import { entities } from './entities';
import { MainProjectServerModule } from '@module-project/infrastructure/framework/project.module';
import { MainEcosystemServerModule } from '@module-eco/infrastructure/framework/ecosystem.module';
import { MainHealthServerModule } from '@app-main/modules/health/infrastructure/framework/main.module';
import { MongoTestConfigOptions } from './mongo-test-config-options';
import { MongoTestType } from './mongo-test.type';
import { mongo_test_loader } from './mongo-test.loader';

export class ModuleFactory {
  public static async createModule(): Promise<TestingModule> {
    return Test.createTestingModule({
      imports: [
        MainHealthServerModule,
        MainEcosystemServerModule,
        MainProjectServerModule,
        ConfigModule.forRoot(MongoTestConfigOptions),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(mongo_test_loader)],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const db = configService.get<MongoTestType>('mongo_test') as MongoTestType;

            if (db === undefined) throw new Error(`MongoType ${db} is not available`);

            const namingStrategy = new DefaultNamingStrategy();

            console.log(db);

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
