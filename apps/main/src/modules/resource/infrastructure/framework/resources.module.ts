import { Module } from '@nestjs/common';
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

@Module({
  imports: [MainActionModule, TypeOrmModule.forFeature([ResourceEntity])],
  controllers: [GetResourceController, CreateResourceController],
  providers: [
    GetResourceService,
    CreateResourceService,
    {
      provide: RESOURCE_REPOSITORY,
      useClass: TypeOrmResourceRepository,
    },
    {
      provide: FACADE_ACTION,
      useClass: ActionFacadeService,
    },
  ],
  exports: [],
})
export class MainResourceModule {}
