import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainProjectServerModule } from '@module-project/infrastructure/framework/project.module';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { CreateModuleController } from '@module-module/infrastructure/controllers/create-module/create-module.controller';
import { CreateModuleService } from '@module-module/application/use-cases/create-module/create-module.service';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { ProjectModuleFacadeService } from '@module-module/infrastructure/domain/services/project-module-facade.service';
import { TypeOrmModuleRepository } from '@module-module/infrastructure/repositories/typeorm-module.repository';
import { UpdateModuleService } from '@module-module/application/use-cases/update-module/update-module.service';
import { UpdateModuleController } from '@module-module/infrastructure/controllers/update-module/update-module.controller';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { ModuleModuleFacade } from '@module-module/infrastructure/api-facade/module-module.facade';
import { GetModuleService } from '@module-module/application/use-cases/get-module/get-module.service';
import { ListModuleController } from '@module-module/infrastructure/controllers/list-module/list-module.controller';
import { ListModuleService } from '@module-module/application/use-cases/list-module/list-module.service';
import { GetModuleController } from '@module-module/infrastructure/controllers/get-module/get-module.controller';
import { DeleteModuleController } from '@module-module/infrastructure/controllers/delete-module/delete-module.controller';
import { DeleteModuleService } from '@module-module/application/use-cases/delete-module/delete-module.service';

@Module({
  imports: [forwardRef(() => MainProjectServerModule), TypeOrmModule.forFeature([ModuleEntity])],
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
    ModuleModuleFacade,
    ListModuleService,
    DeleteModuleService,
    {
      provide: PROJECT_MODULE_FACADE,
      useClass: ProjectModuleFacadeService,
    },
    {
      provide: MODULE_REPOSITORY,
      useClass: TypeOrmModuleRepository,
    },
  ],
  exports: [CreateModuleService, UpdateModuleService, GetModuleService, ModuleModuleFacade],
})
export class MainModuleServerModule {}
