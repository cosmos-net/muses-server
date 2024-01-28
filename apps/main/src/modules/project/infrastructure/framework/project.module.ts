import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainConfigOptions } from '@app-auth/modules/main/infrastructure';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProjectController } from '../controllers/create-project/create-project.controller';
import { ProjectEntity } from '@app-main/modules/commons/infrastructure/domain/project-muses.entity';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), TypeOrmModule.forFeature([ProjectEntity])],
  controllers: [CreateProjectController],
  providers: [CreateProjectService],
})
export class MainProjectServerModule {}
