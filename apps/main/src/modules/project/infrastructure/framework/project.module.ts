import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainConfigOptions } from '@app-auth/modules/main/infrastructure';
import { CreateProjectController } from '../controllers/create-project/create-project.controller';
import { CreateProjectService } from '../../application/use-cases/create-project/create-project.service';
import { ProjectEntity } from '../domain/project-muses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_REPOSITORY, ECOSYSTEM_MODULE_FACADE } from '../../application/constants/injection-token';
import { TypeOrmProjectRepository } from '../repositories/typeorm-project.repository';
import { EcosystemModuleFacadeService } from '../domain/services/ecosystem-module-facade.service';
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
