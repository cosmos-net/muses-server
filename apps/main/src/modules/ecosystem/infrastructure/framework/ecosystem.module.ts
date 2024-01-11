import { Module } from '@nestjs/common';
import { ConfigModule } from '@lib-commons/infrastructure';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import {
  CreateEcosystemController,
  ListEcosystemController,
  UpdateEcosystemController,
} from '@module-eco/infrastructure';
import {
  UpdateEcosystemService,
  ECOSYSTEM_REPOSITORY,
  ListEcosystemService,
  CreateEcosystemService,
} from '@module-eco/application';
import { EcosystemEntity, TypeOrmEcosystemRepository } from '@app-main/modules/commons/infrastructure';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), TypeOrmModule.forFeature([EcosystemEntity])],
  controllers: [UpdateEcosystemController, ListEcosystemController, CreateEcosystemController],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    CreateEcosystemService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmEcosystemRepository,
    },
  ],
})
export class MainEcosystemServerModule {}
