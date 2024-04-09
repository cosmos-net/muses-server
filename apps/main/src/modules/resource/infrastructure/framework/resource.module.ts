import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainActionModule } from '@module-action/infrastructure/framework/action.module';
import { GetResourceController } from '@module-resource/infrastructure/controllers/get-resource/get-resource.controller';
import { GetResourceService } from '@module-resource/application/use-cases/get-resource/get-resource.service';
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { FACADE_ACTION, RESOURCE_REPOSITORY } from '@module-resource/application/constants/injection-token';
import { TypeOrmResourceRepository } from '@module-resource/infrastructure/repositories/typeorm-resource.repository';
import { ActionFacadeService } from '@module-resource/infrastructure/domain/services/action-facade.service';
import { CreateResourceController } from '@module-resource/infrastructure/controllers/create-resource/create-resource.controller';
import { CreateResourceService } from '@module-resource/application/use-cases/create-resource/create-resource.service';
import { ResourceModuleFacade } from '@module-resource/infrastructure/api-facade/resource-module.facade';
import { UpdateResourceController } from '@module-resource/infrastructure/controllers/update-resource/update-resource.controller';
import { UpdateResourceService } from '@module-resource/application/use-cases/update-resource/update-resource.service';
import { EventStoreService } from '@lib-commons/application/event-store.service';

@Module({
  imports: [forwardRef(() => MainActionModule), TypeOrmModule.forFeature([ResourceEntity])],
  controllers: [GetResourceController, CreateResourceController, UpdateResourceController],
  providers: [
    EventStoreService,
    GetResourceService,
    CreateResourceService,
    ResourceModuleFacade,
    UpdateResourceService,
    {
      provide: RESOURCE_REPOSITORY,
      useClass: TypeOrmResourceRepository,
    },
    {
      provide: FACADE_ACTION,
      useClass: ActionFacadeService,
    },
  ],
  exports: [ResourceModuleFacade],
})
export class MainResourceModule {}
