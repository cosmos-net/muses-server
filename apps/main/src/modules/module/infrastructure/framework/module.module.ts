import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainProjectModule } from '@module-project/infrastructure/framework/project.module';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { CreateModuleController } from '@module-module/infrastructure/controllers/create-module/create-module.controller';
import { CreateModuleService } from '@module-module/application/use-cases/create-module/create-module.service';
import {
  ACTION_FACADE,
  MODULE_REPOSITORY,
  PROJECT_MODULE_FACADE,
  SUB_MODULE_MODULE_FACADE,
} from '@module-module/application/constants/injection-tokens';
import { ProjectModuleFacadeService } from '@module-module/infrastructure/domain/services/project-module-facade.service';
import { TypeOrmModuleRepository } from '@module-module/infrastructure/repositories/typeorm-module.repository';
import { UpdateModuleService } from '@module-module/application/use-cases/update-module/update-module.service';
import { UpdateModuleController } from '@module-module/infrastructure/controllers/update-module/update-module.controller';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { ModuleFacade } from '@module-module/infrastructure/api-facade/module-module.facade';
import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { ListModuleController } from '@module-module/infrastructure/controllers/list-module/list-module.controller';
import { ListModuleService } from '@module-module/application/use-cases/list-module/list-module.service';
import { GetModuleController } from '@module-module/infrastructure/controllers/get-module/get-module.controller';
import { DeleteModuleController } from '@module-module/infrastructure/controllers/delete-module/delete-module.controller';
import { DeleteModuleService } from '@module-module/application/use-cases/delete-module/delete-module.service';
import { ModuleListener } from '@module-module/infrastructure/domain/listeners/module.listener';
import { OverwriteSubModuleOnModuleEventHandler } from '@module-module/application/event-handlers/overwrite-sub-module-on-module-event.handler';
import { RelateSubModuleWithModuleEventHandler } from '@module-module/application/event-handlers/relate-submodule-with-module-event.handler';
import { RemoveDisabledSubModuleFromModuleEventHandler } from '@module-module/application/event-handlers/remove-disabled-sub-module-from-module-event.handler';
import { ExchangeSubModuleModuleService } from '@module-module/application/use-cases/exchange-sub-module-module/exchange-sub-module-module.service';
import { AddSubModuleService } from '@module-module/application/use-cases/add-submodule/add-submodule.service';
import { RemoveSubModuleService } from '@module-module/application/use-cases/remove-sub-modules/remove-sub-modules.service';
import { SubModuleFacadeService } from '@module-module/infrastructure/domain/services/module-sub-module-facade.service';
import { MainSubModuleModule } from '@module-sub-module/infrastructure/framework/sub-module.module';
import { GetModulesByIdsService } from '@module-module/application/use-cases/get-modules-by-ids/get-modules-by-ids.service';
import { ActionFacadeService } from '@module-module/infrastructure/domain/services/action-facade.service';
import { MainActionModule } from '@app-main/modules/action/infrastructure/framework/action.module';
import { UpdateRelationsWithModulesEventHandler } from '@module-module/application/event-handlers/update-relations-with-modules-event.handler';
import { ExchangeActionModulesService } from '@module-module/application/use-cases/exchange-action-modules/exchange-action-modules.service';

@Module({
  imports: [
    forwardRef(() => MainProjectModule),
    forwardRef(() => MainActionModule),
    MainSubModuleModule,
    TypeOrmModule.forFeature([ModuleEntity]),
  ],
  controllers: [
    CreateModuleController,
    UpdateModuleController,
    ListModuleController,
    GetModuleController,
    DeleteModuleController,
  ],
  providers: [
    EventStoreService,
    CreateModuleService,
    UpdateModuleService,
    GetModuleService,
    ModuleFacade,
    ListModuleService,
    DeleteModuleService,
    ModuleListener,
    OverwriteSubModuleOnModuleEventHandler,
    RelateSubModuleWithModuleEventHandler,
    RemoveDisabledSubModuleFromModuleEventHandler,
    ExchangeSubModuleModuleService,
    AddSubModuleService,
    RemoveSubModuleService,
    GetModulesByIdsService,
    ActionFacadeService,
    UpdateRelationsWithModulesEventHandler,
    ExchangeActionModulesService,
    {
      provide: PROJECT_MODULE_FACADE,
      useClass: ProjectModuleFacadeService,
    },
    {
      provide: MODULE_REPOSITORY,
      useClass: TypeOrmModuleRepository,
    },
    {
      provide: SUB_MODULE_MODULE_FACADE,
      useClass: SubModuleFacadeService,
    },
    {
      provide: ACTION_FACADE,
      useClass: ActionFacadeService,
    },
  ],
  exports: [
    CreateModuleService,
    UpdateModuleService,
    GetModuleService,
    ModuleFacade,
    ModuleListener,
    OverwriteSubModuleOnModuleEventHandler,
    RelateSubModuleWithModuleEventHandler,
    RemoveDisabledSubModuleFromModuleEventHandler,
    ExchangeSubModuleModuleService,
    AddSubModuleService,
    RemoveSubModuleService,
    GetModulesByIdsService,
  ],
})
export class MainModuleModule {}
