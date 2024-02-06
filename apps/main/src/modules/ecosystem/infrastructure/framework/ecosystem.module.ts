import { Module } from '@nestjs/common';
import { ConfigModule } from '@lib-commons/infrastructure';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import {
  CreateEcosystemController,
  ListEcosystemController,
  UpdateEcosystemController,
  DeleteEcosystemController,
} from '@module-eco/infrastructure';
import {
  UpdateEcosystemService,
  ECOSYSTEM_REPOSITORY,
  ListEcosystemService,
  CreateEcosystemService,
  DeleteEcosystemService,
} from '@module-eco/application';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetrieveEcosystemController } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/retrieve-ecosystem.controller';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { EcosystemModuleFacade } from '@module-eco/infrastructure/api-facade/ecosystem-module.facade';
import { TypeOrmEcosystemRepository } from '@module-eco/infrastructure/repositories/typeorm-ecosystem.repository';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), TypeOrmModule.forFeature([EcosystemEntity])],
  controllers: [
    UpdateEcosystemController,
    ListEcosystemController,
    CreateEcosystemController,
    RetrieveEcosystemController,
    DeleteEcosystemController,
  ],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    CreateEcosystemService,
    RetrieveEcosystemService,
    DeleteEcosystemService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmEcosystemRepository,
    },
    EcosystemModuleFacade,
  ],
  exports: [RetrieveEcosystemService, EcosystemModuleFacade],
})
export class MainEcosystemServerModule {}
