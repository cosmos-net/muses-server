import { Module } from '@nestjs/common';
import { GetSubModuleController } from '@module-sub-module/infrastructure/controllers/get-sub-module/get-sub-module.controller';
import { GetSubModuleService } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.service';
import { SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { TypeOrmSubModuleRepository } from '@module-sub-module/infrastructure/repositories/typeorm-sub-module.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubModuleEntity])],
  controllers: [GetSubModuleController],
  providers: [
    GetSubModuleService,
    {
      provide: SUB_MODULE_REPOSITORY,
      useClass: TypeOrmSubModuleRepository,
    },
  ],
})
export class MainSubModuleModule {}
