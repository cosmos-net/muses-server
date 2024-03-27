import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetActionController } from '@module-action/infrastructure/controllers/get-action/get-action.controller';
import { GetActionService } from '@module-action/application/use-cases/get-action/get-action.service';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { TypeOrmActionRepository } from '@module-action/infrastructure/repositories/typeorm-action.repository';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { ModuleFacadeService } from '@module-action/infrastructure/framework/services/module-facade.service';
import { SubModuleFacadeService } from '@module-action/infrastructure/framework/services/sub-module-facade.service';
import { UpdateActionService } from '@module-action/application/use-cases/update-action/update-action.service';
import { MainSubModuleModule } from '@app-main/modules/sub-module/infrastructure/framework/sub-module.module';
import { MainModuleModule } from '@app-main/modules/module/infrastructure/framework/module.module';
import { UpdateActionController } from '@module-action/infrastructure/controllers/update-action/update-action.controller';
import { CreateActionService } from '@module-action/application/use-cases/create-action/create-action.service';
import { CreateActionController } from '@module-action/infrastructure/controllers/create-action/create-action.controller';
import { ActionFacade } from '@module-action/infrastructure/api-facade/action.facade';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { ListActionController } from '@module-action/infrastructure/controllers/list-action/list-action.controller';
import { ListActionService } from '@module-action/application/use-cases/list-actions/list-action.service';

@Module({
  imports: [
    forwardRef(() => MainModuleModule),
    forwardRef(() => MainSubModuleModule),
    TypeOrmModule.forFeature([ActionEntity]),
  ],
  controllers: [GetActionController, CreateActionController, UpdateActionController, ListActionController],
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
  ],
  exports: [
    ListActionService,
    GetActionService,
    UpdateActionService,
    ModuleFacadeService,
    SubModuleFacadeService,
    ActionFacade,
  ],
})
export class MainActionModule {}
