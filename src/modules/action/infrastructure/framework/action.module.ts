import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetActionController } from '@module-action/infrastructure/controllers/action/get-action/get-action.controller';
import { GetActionService } from '@module-action/application/use-cases/action/get-action/get-action.service';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  RESOURCE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { TypeOrmActionRepository } from '@module-action/infrastructure/repositories/typeorm-action.repository';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { ModuleFacadeService } from '@module-action/infrastructure/domain/services/module-facade.service';
import { SubModuleFacadeService } from '@module-action/infrastructure/domain/services/sub-module-facade.service';
import { UpdateActionService } from '@module-action/application/use-cases/action/update-action/update-action.service';
import { MainSubModuleModule } from '@module-sub-module/infrastructure/framework/sub-module.module';
import { MainModuleModule } from '@module-module/infrastructure/framework/module.module';
import { UpdateActionController } from '@module-action/infrastructure/controllers/action/update-action/update-action.controller';
import { CreateActionService } from '@module-action/application/use-cases/action/create-action/create-action.service';
import { CreateActionController } from '@module-action/infrastructure/controllers/action/create-action/create-action.controller';
import { ActionFacade } from '@module-action/infrastructure/api-facade/action.facade';
import { EventStoreService } from '@core/application/event-store.service';
import { ListActionController } from '@module-action/infrastructure/controllers/action/list-action/list-action.controller';
import { ListActionService } from '@module-action/application/use-cases/action/list-actions/list-action.service';
import { DisableActionService } from '@module-action/application/use-cases/action/disable-action/disable-action.service';
import { DisableActionController } from '@module-action/infrastructure/controllers/action/disable-action/disable-action.controller';
import { GetAllActionByIds } from '@module-action/application/use-cases/action/get-all-action-by-ids/get-all-action-by-ids.service';
import { ActionListener } from '@module-action/infrastructure/domain/listeners/action.listener';
import { UpdateRelationsWithResourceEventHandler } from '@module-action/application/event-handlers/update-relations-with-resource-event.handler';
import { AddResourceService } from '@module-action/application/use-cases/action/add-resource/add-resource.service';
import { RemoveResourceService } from '@module-action/application/use-cases/action/remove-resource/remove-resource.service';
import { ResourceFacadeService } from '@module-action/infrastructure/domain/services/resource-facade.service';
import { MainResourceModule } from '@module-resource/infrastructure/framework/resource.module';
import { CreateActionCatalogController } from '@module-action/infrastructure/controllers/action-catalog/create-action-catalog/create-action-catalog.controller';
import { GetActionCatalogController } from '@module-action/infrastructure/controllers/action-catalog/get-action-catalog/get-action-catalog.controller';
import { ListActionCatalogController } from '@module-action/infrastructure/controllers/action-catalog/list-action-catalog/list-action-catalog.controller';
import { CreateActionCatalogService } from '@module-action/application/use-cases/action-catalog/create-action-catalog/create-action-catalog.service';
import { GetActionCatalogService } from '@module-action/application/use-cases/action-catalog/get-action-catalog/get-action-catalog.service';
import { ListActionCatalogService } from '@module-action/application/use-cases/action-catalog/list-action-catalog/list-action-catalog.service';

@Module({
  imports: [
    forwardRef(() => MainModuleModule),
    forwardRef(() => MainSubModuleModule),
    forwardRef(() => MainResourceModule),
    TypeOrmModule.forFeature([ActionEntity]),
  ],
  controllers: [
    ListActionController,
    GetActionController,
    CreateActionController,
    UpdateActionController,
    DisableActionController,
    CreateActionCatalogController,
    GetActionCatalogController,
    ListActionCatalogController
  ],
  providers: [
    EventStoreService,
    GetActionService,
    CreateActionService,
    UpdateActionService,
    ModuleFacadeService,
    SubModuleFacadeService,
    ActionFacade,
    ListActionService,
    DisableActionService,
    GetAllActionByIds,
    ActionListener,
    UpdateRelationsWithResourceEventHandler,
    AddResourceService,
    RemoveResourceService,
    CreateActionCatalogService,
    GetActionCatalogService,
    ListActionCatalogService,
    {
      provide: ACTION_REPOSITORY,
      useClass: TypeOrmActionRepository,
    },
    {
      provide: SUB_MODULE_FACADE,
      useClass: SubModuleFacadeService,
    },
    {
      provide: MODULE_FACADE,
      useClass: ModuleFacadeService,
    },
    {
      provide: RESOURCE_FACADE,
      useClass: ResourceFacadeService,
    },
  ],
  exports: [
    ListActionService,
    GetActionService,
    UpdateActionService,
    ModuleFacadeService,
    SubModuleFacadeService,
    DisableActionService,
    ActionFacade,
    GetAllActionByIds,
  ],
})
export class MainActionModule {}
