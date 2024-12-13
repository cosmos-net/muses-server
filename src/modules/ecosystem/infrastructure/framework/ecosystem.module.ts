import { forwardRef, Module } from '@nestjs/common';
import { CreateEcosystemController } from '@module-eco/infrastructure/controllers/create-ecosystem/create-ecosystem.controller';
import { DisableEcosystemController } from '@module-eco/infrastructure/controllers/disable-ecosystem/disable-ecosystem.controller';
import { ListEcosystemController } from '@module-eco/infrastructure/controllers/list-ecosystem/list-ecosystem.controller';
import { UpdateEcosystemController } from '@module-eco/infrastructure/controllers/update-ecosystem/update-ecosystem.controller';
import { CreateEcosystemService } from '@module-eco/application/use-cases/create-ecosystem/create-ecosystem.service';
import { DisableEcosystemService } from '@module-eco/application/use-cases/disable-ecosystem/disable-ecosystem.service';
import { ListEcosystemService } from '@module-eco/application/use-cases/list-ecosystem/list-ecosystem.service';
import { UpdateEcosystemService } from '@module-eco/application/use-cases/update-ecosystem/update-ecosystem.service';
import { ECOSYSTEM_REPOSITORY, PROJECT_FACADE } from '@module-eco/application/constants/injection-token';
import { RetrieveEcosystemController } from '@module-eco/infrastructure/controllers/retrieve-ecosystem/retrieve-ecosystem.controller';
import { RetrieveEcosystemService } from '@module-eco/application/use-cases/retrieve-ecosystem/retrieve-ecosystem.service';
import { EcosystemModuleFacade } from '@module-eco/infrastructure/api-facade/ecosystem-module.facade';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { TypeOrmEcosystemRepository } from '@module-eco/infrastructure/repositories/typeorm-ecosystem.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectFacadeService } from '@module-eco/infrastructure/domain/services/project-facade.service';
import { EcosystemListener } from '@module-eco/infrastructure/listeners/ecosystem.listener';
import { UpdateRelationsWithProjectEventHandler } from '@module-eco/application/event-handlers/update-relations-with-resource-event.handler';
import { AddProjectService } from '@module-eco/application/use-cases/add-project-service/add-project.service';
import { RemoveProjectService } from '@module-eco/application/use-cases/remove-project-service/remove-project.service';
import { MainProjectModule } from '@module-project/infrastructure/framework/project.module';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { MusesClientNatsModule } from './muses-client-nats.context';

@Module({
  imports: [
    forwardRef(() => MainProjectModule),
    TypeOrmModule.forFeature([EcosystemEntity]),
    MusesClientNatsModule,
    ClientsModule.register([
      {
        name: 'MUSES_CONTEXT_NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [
    UpdateEcosystemController,
    ListEcosystemController,
    CreateEcosystemController,
    RetrieveEcosystemController,
    DisableEcosystemController,
  ],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    CreateEcosystemService,
    RetrieveEcosystemService,
    DisableEcosystemService,
    ProjectFacadeService,
    EcosystemListener,
    UpdateRelationsWithProjectEventHandler,
    AddProjectService,
    RemoveProjectService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmEcosystemRepository,
    },
    {
      provide: PROJECT_FACADE,
      useClass: ProjectFacadeService,
    },
    EcosystemModuleFacade,
  ],
  exports: [
    RetrieveEcosystemService,
    EcosystemModuleFacade
  ],
})
export class MainEcosystemModule {}
