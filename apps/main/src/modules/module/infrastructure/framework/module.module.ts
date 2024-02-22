import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@lib-commons/infrastructure/framework/common-main.module';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure/config/options/config.options';
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

@Module({
  imports: [
    forwardRef(() => MainProjectServerModule),
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forFeature([ModuleEntity]),
  ],
  controllers: [CreateModuleController, UpdateModuleController],
  providers: [
    EventStoreService,
    CreateModuleService,
    UpdateModuleService,
    GetModuleService,
    ModuleModuleFacade,
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
