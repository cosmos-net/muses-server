import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetActionController } from '@module-action/infrastructure/controllers/get-action/get-action.controller';
import { GetActionService } from '@module-action/application/use-cases/get-action/get-action.service';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  RESOURCE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { TypeOrmActionRepository } from '@module-action/infrastructure/repositories/typeorm-action.repository';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { ModuleFacadeService } from '@app-main/modules/action/infrastructure/domain/services/module-facade.service';
import { SubModuleFacadeService } from '@app-main/modules/action/infrastructure/domain/services/sub-module-facade.service';
import { UpdateActionService } from '@module-action/application/use-cases/update-action/update-action.service';
import { MainSubModuleModule } from '@module-sub-module/infrastructure/framework/sub-module.module';
import { MainModuleModule } from '@module-module/infrastructure/framework/module.module';
import { UpdateActionController } from '@module-action/infrastructure/controllers/update-action/update-action.controller';
import { CreateActionService } from '@module-action/application/use-cases/create-action/create-action.service';
import { CreateActionController } from '@module-action/infrastructure/controllers/create-action/create-action.controller';
import { ActionFacade } from '@module-action/infrastructure/api-facade/action.facade';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { ListActionController } from '@module-action/infrastructure/controllers/list-action/list-action.controller';
import { ListActionService } from '@module-action/application/use-cases/list-actions/list-action.service';
import { DisableActionService } from '@module-action/application/use-cases/disable-action/disable-action.service';
import { DisableActionController } from '@module-action/infrastructure/controllers/disable-action/disable-action.controller';
import { GetAllActionByIds } from '@module-action/application/use-cases/get-all-action-by-ids/get-all-action-by-ids.service';
import { ActionListener } from '@module-action/infrastructure/domain/listeners/action.listener';
import { UpdateRelationsWithResourceEventHandler } from '@module-action/application/event-handlers/update-relations-with-resource-event.handler';
import { AddResourceService } from '@module-action/application/use-cases/add-resource/add-resource.service';
import { RemoveResourceService } from '@module-action/application/use-cases/remove-resource/remove-resource.service';
import { ResourceFacadeService } from '@module-action/infrastructure/domain/services/resource-facade.service';
import { MainResourceModule } from '@module-resource/infrastructure/framework/resource.module';

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
  ],
  providers: [
    EventStoreService,
    GetActionService,
    CreateActionService,
    UpdateActionService,
    ModuleFacadeService,
    SubModuleFacadeService,
    ActionFacade,
    EventStoreService,
    ListActionService,
    DisableActionService,
    GetAllActionByIds,
    ActionListener,
    UpdateRelationsWithResourceEventHandler,
    AddResourceService,
    RemoveResourceService,
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
