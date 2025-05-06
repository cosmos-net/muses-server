import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProjectController } from '@module-project/infrastructure/controllers/create-project/create-project.controller';
import { CreateProjectService } from '@module-project/application/use-cases/create-project/create-project.service';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import {
  PROJECT_REPOSITORY,
  ECOSYSTEM_MODULE_FACADE,
  MODULE_MODULE_FACADE,
} from '@module-project/application/constants/injection-token';
import { TypeOrmProjectRepository } from '@module-project/infrastructure/repositories/typeorm-project.repository';
import { EcosystemModuleFacadeService } from '@module-project/infrastructure/domain/services/ecosystem-module-facade.service';
import { MainEcosystemModule } from '@module-eco/infrastructure/framework/ecosystem.module';
import { DeleteProjectController } from '@module-project/infrastructure/controllers/delete-project/delete-project.controller';
import { GetProjectController } from '@module-project/infrastructure/controllers/get-project/get-project.controller';
import { ListProjectController } from '@module-project/infrastructure/controllers/list-project/list-project.controller';
import { UpdateProjectController } from '@module-project/infrastructure/controllers/update-project/update-project.controller';
import { DeleteProjectService } from '@module-project/application/use-cases/delete-project/delete-project.service';
import { GetProjectService } from '@module-project/application/use-cases/get-project/get-project.service';
import { ListProjectService } from '@module-project/application/use-cases/list-project/list-project.service';
import { UpdateProjectService } from '@module-project/application/use-cases/update-project/update-project.service';
import { ProjectModuleFacade } from '@module-project/infrastructure/api-facade/project-module.facade';
import { ProjectListener } from '@module-project/infrastructure/domain/listeners/project.listener';
import { RelateModuleWithProjectEventHandler } from '@module-project/application/event-handlers/relate-module-with-project-event.handler';
import { AddModuleService } from '@module-project/application/use-cases/add-module/add-module.service';
import { ModuleModuleFacadeService } from '@module-project/infrastructure/domain/services/module-module-facade.service';
import { MainModuleModule } from '@module-module/infrastructure/framework/module.module';
import { OverwriteModuleOnProjectEventHandler } from '@module-project/application/event-handlers/overwrite-module-on-project-event.handler';
import { ExchangeModuleProjectsService } from '@module-project/application/use-cases/exchange-module-projects/exchange-module-projects.service';
import { EventStoreService } from '@core/application/event-store.service';

@Module({
  imports: [
    forwardRef(() => MainEcosystemModule),
    forwardRef(() => MainModuleModule),
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [
    CreateProjectController,
    DeleteProjectController,
    ListProjectController,
    UpdateProjectController,
    GetProjectController,
  ],
  providers: [
    EventStoreService,
    CreateProjectService,
    DeleteProjectService,
    ListProjectService,
    UpdateProjectService,
    GetProjectService,
    {
      provide: ECOSYSTEM_MODULE_FACADE,
      useClass: EcosystemModuleFacadeService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: TypeOrmProjectRepository,
    },
    {
      provide: MODULE_MODULE_FACADE,
      useClass: ModuleModuleFacadeService,
    },
    ProjectModuleFacade,
    ProjectListener,
    RelateModuleWithProjectEventHandler,
    AddModuleService,
    OverwriteModuleOnProjectEventHandler,
    ExchangeModuleProjectsService,
  ],
  exports: [GetProjectService, ProjectModuleFacade],
})
export class MainProjectModule {}
