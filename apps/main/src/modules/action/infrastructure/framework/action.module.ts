import { Module } from '@nestjs/common';
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

@Module({
  imports: [MainModuleModule, MainSubModuleModule, TypeOrmModule.forFeature([ActionEntity])],
  controllers: [GetActionController, UpdateActionController],
  providers: [
    GetActionService,
    UpdateActionService,
    ModuleFacadeService,
    SubModuleFacadeService,
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
  exports: [GetActionService, UpdateActionService, ModuleFacadeService, SubModuleFacadeService],
})
export class MainActionModule {}
