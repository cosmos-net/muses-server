import { Module, forwardRef } from '@nestjs/common';
import { GetSubModuleController } from '@module-sub-module/infrastructure/controllers/get-sub-module/get-sub-module.controller';
import { GetSubModuleService } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.service';
import {
  ACTION_FACADE,
  MODULE_FACADE,
  SUB_MODULE_REPOSITORY,
} from '@module-sub-module/application/constants/injection-token';
import { TypeOrmSubModuleRepository } from '@module-sub-module/infrastructure/repositories/typeorm-sub-module.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { CreateSubModuleController } from '@module-sub-module/infrastructure/controllers/create-sub-module/create-sub-module.controller';
import { CreateSubModuleService } from '@module-sub-module/application/use-cases/create-sub-module/create-sub-module.service';
import { ModuleFacadeService } from '@module-sub-module/infrastructure/domain/services/sub-module-module-facade.service';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { MainModuleModule } from '@module-module/infrastructure/framework/module.module';
import { ListSubModuleController } from '@module-sub-module/infrastructure/controllers/list-sub-module/list-sub-module.controller';
import { ListSubModuleService } from '@module-sub-module/application/use-cases/list-sub-module/list-sub-module.service';
import { DeleteSubModuleController } from '@module-sub-module/infrastructure/controllers/delete-sub-module/delete-sub-module.controller';
import { DeleteSubModuleService } from '@module-sub-module/application/use-cases/delete-sub-module/delete-sub-module.service';
import { SubModuleFacade } from '@module-sub-module/infrastructure/api-facade/sub-module.facade';
import { UpdateSubModuleService } from '@module-sub-module/application/use-cases/update-sub-module/update-sub-module.service';
import { UpdateSubModuleController } from '@module-sub-module/infrastructure/controllers/update-sub-module/update-sub-module.controller';
import { GetSubModulesByIdsService } from '@module-sub-module/application/use-cases/get-sub-modules-by-ids/get-modules-by-ids.service';
import { SubModuleListener } from '@module-sub-module/infrastructure/domain/listeners/sub-module.listener';
import { UpdateRelationsWithSubModulesEventHandler } from '@module-sub-module/application/event-handlers/update-relations-with-sub-modules-event.handler';
import { ExchangeActionSubModulesService } from '@module-sub-module/application/use-cases/exchange-action-sub-modules/exchange-action-sub-modules.service';
import { MainActionModule } from '@module-action/infrastructure/framework/action.module';
import { ActionFacadeService } from '@module-sub-module/infrastructure/domain/services/action-facade.service';
import { RelateActionWithSubModuleEventHandler } from '@module-sub-module/application/event-handlers/relate-action-with-sub-module-event.handler';
import { AddActionService } from '@module-sub-module/application/use-cases/add-action/add-action.service';

@Module({
  imports: [
    forwardRef(() => MainModuleModule),
    forwardRef(() => MainActionModule),
    TypeOrmModule.forFeature([SubModuleEntity]),
  ],
  controllers: [
    ListSubModuleController,
    GetSubModuleController,
    CreateSubModuleController,
    DeleteSubModuleController,
    UpdateSubModuleController,
  ],
  providers: [
    EventStoreService,
    ListSubModuleService,
    GetSubModuleService,
    CreateSubModuleService,
    DeleteSubModuleService,
    UpdateSubModuleService,
    SubModuleFacade,
    GetSubModulesByIdsService,
    SubModuleListener,
    UpdateRelationsWithSubModulesEventHandler,
    ExchangeActionSubModulesService,
    ActionFacadeService,
    AddActionService,
    RelateActionWithSubModuleEventHandler,
    {
      provide: MODULE_FACADE,
      useClass: ModuleFacadeService,
    },
    {
      provide: SUB_MODULE_REPOSITORY,
      useClass: TypeOrmSubModuleRepository,
    },
    {
      provide: ACTION_FACADE,
      useClass: ActionFacadeService,
    },
  ],
  exports: [
    ListSubModuleService,
    GetSubModuleService,
    CreateSubModuleService,
    DeleteSubModuleService,
    UpdateSubModuleService,
    SubModuleFacade,
    GetSubModulesByIdsService,
  ],
})
export class MainSubModuleModule {}
