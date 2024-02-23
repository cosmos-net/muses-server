import { Module } from '@nestjs/common';
import { CreateEcosystemController } from '@module-eco/infrastructure/controllers/create-ecosystem/create-ecosystem.controller';
import { DeleteEcosystemController } from '@module-eco/infrastructure/controllers/delete-ecosystem/delete-ecosystem.controller';
import { ListEcosystemController } from '@module-eco/infrastructure/controllers/list-ecosystem/list-ecosystem.controller';
import { UpdateEcosystemController } from '@module-eco/infrastructure/controllers/update-ecosystem/update-ecosystem.controller';
import { CreateEcosystemService } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.service';
import { DeleteEcosystemService } from '@module-eco/application/use-cases/delete-ecosystem/delete-ecosystem.service';
import { ListEcosystemService } from '@module-eco/application/use-cases/list-ecosystem/list-ecosystem.service';
import { UpdateEcosystemService } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.service';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetrieveEcosystemController } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/retrieve-ecosystem.controller';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { EcosystemModuleFacade } from '@module-eco/infrastructure/api-facade/ecosystem-module.facade';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { TypeOrmEcosystemRepository } from '@module-eco/infrastructure/repositories/typeorm-ecosystem.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EcosystemEntity])],
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
