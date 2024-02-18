import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure/config/options/config.options';
import { CreateProjectController } from '@module-project/infrastructure/controllers/create-project/create-project.controller';
import { CreateProjectService } from '@module-project/application/use-cases/create-project/create-project.service';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_REPOSITORY, ECOSYSTEM_MODULE_FACADE } from '@module-project/application/constants/injection-token';
import { TypeOrmProjectRepository } from '@module-project/infrastructure/repositories/typeorm-project.repository';
import { EcosystemModuleFacadeService } from '@module-project/infrastructure/domain/services/ecosystem-module-facade.service';
import { MainEcosystemServerModule } from '@module-eco/infrastructure/framework/ecosystem.module';
import { DeleteProjectController } from '@module-project/infrastructure/controllers/delete-project/delete-project.controller';
import { GetProjectController } from '@module-project/infrastructure/controllers/get-project/get-project.controller';
import { ListProjectController } from '@module-project/infrastructure/controllers/list-project/list-project.controller';
import { UpdateProjectController } from '@module-project/infrastructure/controllers/update-project/update-project.controller';
import { DeleteProjectService } from '@module-project/application/use-cases/delete-project/delete-project.service';
import { GetProjectService } from '@module-project/application/use-cases/get-project/get-project.service';
import { ListProjectService } from '@module-project/application/use-cases/list-project/list-project.service';
import { UpdateProjectService } from '@module-project/application/use-cases/update-project/update-project.service';
import { ConfigModule } from '@lib-commons/infrastructure/framework/common-main.module';

@Module({
  imports: [MainEcosystemServerModule, TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [
    CreateProjectController,
    DeleteProjectController,
    ListProjectController,
    UpdateProjectController,
    GetProjectController,
  ],
  providers: [
    CreateProjectService,
    DeleteProjectService,
    ListProjectService,
    UpdateProjectService,
    GetProjectService,
    {
      provide: ECOSYSTEM_MODULE_FACADE,
      useClass: EcosystemModuleFacadeService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: TypeOrmProjectRepository,
    },
  ],
})
export class MainProjectServerModule {}
