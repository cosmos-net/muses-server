import { forwardRef, Module } from '@nestjs/common';
import { CreateEcosystemController } from '@context-ecosystem/infrastructure/controllers/create-ecosystem/create-ecosystem.controller';
import { DisableEcosystemController } from '@context-ecosystem/infrastructure/controllers/disable-ecosystem/disable-ecosystem.controller';
import { ListEcosystemController } from '@context-ecosystem/infrastructure/controllers/list-ecosystem/list-ecosystem.controller';
import { UpdateEcosystemController } from '@context-ecosystem/infrastructure/controllers/update-ecosystem/update-ecosystem.controller';
import { CreateEcosystemService } from '@context-ecosystem/application/use-cases/create-ecosystem/create-ecosystem.service';
import { DisableEcosystemService } from '@context-ecosystem/application/use-cases/disable-ecosystem/disable-ecosystem.service';
import { ListEcosystemService } from '@context-ecosystem/application/use-cases/list-ecosystem/list-ecosystem.service';
import { UpdateEcosystemService } from '@context-ecosystem/application/use-cases/update-ecosystem/update-ecosystem.service';
import { ECOSYSTEM_REPOSITORY, PROJECT_FACADE } from '@context-ecosystem/application/constants/injection-token';
import { RetrieveEcosystemController } from '@context-ecosystem/infrastructure/controllers/retrieve-ecosystem/retrieve-ecosystem.controller';
import { RetrieveEcosystemService } from '@context-ecosystem/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { EcosystemModuleFacade } from '@context-ecosystem/infrastructure/api-facade/ecosystem-module.facade';
import { EcosystemEntity } from '@context-ecosystem/infrastructure/domain/ecosystem-muses.entity';
import { TypeOrmEcosystemRepository } from '@context-ecosystem/infrastructure/repositories/typeorm-ecosystem.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectFacadeService } from '@context-ecosystem/infrastructure/domain/services/project-facade.service';
import { EcosystemListener } from '@context-ecosystem/infrastructure/listeners/ecosystem.listener';
import { UpdateRelationsWithProjectEventHandler } from '@context-ecosystem/application/event-handlers/update-relations-with-resource-event.handler';
import { AddProjectService } from '@context-ecosystem/application/use-cases/add-project-service/add-project.service';
import { RemoveProjectService } from '@context-ecosystem/application/use-cases/remove-project-service/remove-project.service';
import { MainProjectModule } from '@module-project/infrastructure/framework/project.module';

@Module({
  imports: [
    forwardRef(() => MainProjectModule),
    TypeOrmModule.forFeature([EcosystemEntity]),
  ],
  controllers: [
    CreateEcosystemController,
    UpdateEcosystemController,
    ListEcosystemController,
    RetrieveEcosystemController,
    DisableEcosystemController,
  ],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    CreateEcosystemService,
    RetrieveEcosystemService,
    DisableEcosystemService,
    ProjectFacadeService,
    EcosystemListener,
    UpdateRelationsWithProjectEventHandler,
    AddProjectService,
    RemoveProjectService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmEcosystemRepository,
    },
    {
      provide: PROJECT_FACADE,
      useClass: ProjectFacadeService,
    },
    EcosystemModuleFacade,
  ],
  exports: [
    RetrieveEcosystemService,
    EcosystemModuleFacade
  ],
})
export class EcosystemContext {}
