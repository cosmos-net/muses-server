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
import { RetrieveEcosystemController } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/retrieve-ecosystem.controller';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), TypeOrmModule.forFeature([EcosystemEntity])],
  controllers: [
    UpdateEcosystemController,
    ListEcosystemController,
    CreateEcosystemController,
    RetrieveEcosystemController,
  ],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    CreateEcosystemService,
    RetrieveEcosystemService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmEcosystemRepository,
    },
  ],
})
export class MainEcosystemServerModule {}
