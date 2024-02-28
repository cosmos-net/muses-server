import { Module, forwardRef } from '@nestjs/common';
import { GetSubModuleController } from '@module-sub-module/infrastructure/controllers/get-sub-module/get-sub-module.controller';
import { GetSubModuleService } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.service';
import {
  SUB_MODULE_MODULE_FACADE,
  SUB_MODULE_REPOSITORY,
} from '@module-sub-module/application/constants/injection-token';
import { TypeOrmSubModuleRepository } from '@module-sub-module/infrastructure/repositories/typeorm-sub-module.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { CreateSubModuleController } from '../controllers/create-sub-module/create-sub-module.controller';
import { CreateSubModuleService } from '../../application/use-cases/create-sub-module/create-sub-module.service';
import { SubModuleModuleFacadeService } from '../domain/services/sub-module-module-facade.service';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { MainModuleModule } from '@app-main/modules/module/infrastructure/framework/module.module';

@Module({
  imports: [forwardRef(() => MainModuleModule), TypeOrmModule.forFeature([SubModuleEntity])],
  controllers: [GetSubModuleController, CreateSubModuleController],
  providers: [
    EventStoreService,
    GetSubModuleService,
    CreateSubModuleService,
    {
      provide: SUB_MODULE_MODULE_FACADE,
      useClass: SubModuleModuleFacadeService,
    },
    {
      provide: SUB_MODULE_REPOSITORY,
      useClass: TypeOrmSubModuleRepository,
    },
  ],
})
export class MainSubModuleModule {}
