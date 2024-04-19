import { Module } from '@nestjs/common';
import { CreateEcosystemController } from '@module-eco/infrastructure/controllers/create-ecosystem/create-ecosystem.controller';
import { DisableEcosystemController } from '@app-main/modules/ecosystem/infrastructure/controllers/disable-ecosystem/disable-ecosystem.controller';
import { ListEcosystemController } from '@module-eco/infrastructure/controllers/list-ecosystem/list-ecosystem.controller';
import { UpdateEcosystemController } from '@module-eco/infrastructure/controllers/update-ecosystem/update-ecosystem.controller';
import { CreateEcosystemService } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.service';
import { DisableEcosystemService } from '@app-main/modules/ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.service';
import { ListEcosystemService } from '@module-eco/application/use-cases/list-ecosystem/list-ecosystem.service';
import { UpdateEcosystemService } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.service';
import { ECOSYSTEM_REPOSITORY } from '@module-eco/application/constants/injection-token';
import { RetrieveEcosystemController } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/retrieve-ecosystem.controller';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { EcosystemModuleFacade } from '@module-eco/infrastructure/api-facade/ecosystem-module.facade';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { TypeOrmEcosystemRepository } from '@module-eco/infrastructure/repositories/typeorm-ecosystem.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EcosystemEntity])],
  controllers: [
    UpdateEcosystemController,
    ListEcosystemController,
    CreateEcosystemController,
    RetrieveEcosystemController,
    DisableEcosystemController,
  ],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    CreateEcosystemService,
    RetrieveEcosystemService,
    DisableEcosystemService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmEcosystemRepository,
    },
    EcosystemModuleFacade,
  ],
  exports: [RetrieveEcosystemService, EcosystemModuleFacade],
})
export class MainEcosystemModule {}
