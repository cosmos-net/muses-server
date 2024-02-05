import { Module } from '@nestjs/common';
import { ConfigModule } from '@lib-commons/infrastructure';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { CreateProjectController } from '@module-project/infrastructure/controllers/create-project/create-project.controller';
import { CreateProjectService } from '@module-project/application/use-cases/create-project/create-project.service';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_REPOSITORY, ECOSYSTEM_MODULE_FACADE } from '@module-project/application/constants/injection-token';
import { TypeOrmProjectRepository } from '@module-project/infrastructure/repositories/typeorm-project.repository';
import { EcosystemModuleFacadeService } from '@module-project/infrastructure/domain/services/ecosystem-module-facade.service';
import { MainEcosystemServerModule } from '@app-main/modules/ecosystem/infrastructure';

@Module({
  imports: [
    MainEcosystemServerModule,
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [CreateProjectController],
  providers: [
    {
      provide: ECOSYSTEM_MODULE_FACADE,
      useClass: EcosystemModuleFacadeService,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: TypeOrmProjectRepository,
    },
    CreateProjectService,
  ],
})
export class MainProjectServerModule {}
