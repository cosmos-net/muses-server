import { ConfigModule, DatabasesLoader } from '@lib-commons/infrastructure';
import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { MainHealthServerModule } from '@app-main/modules/health/infrastructure';
import { MainEcosystemServerModule } from '@module-eco/infrastructure';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MongoType } from '@lib-commons/domain';
import { DefaultNamingStrategy } from 'typeorm';
import { MainProjectServerModule } from '@module-project/infrastructure/framework/project.module';

@Module({
  imports: [
    MainHealthServerModule,
    MainEcosystemServerModule,
    MainProjectServerModule,
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DatabasesLoader.postgres)],
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
