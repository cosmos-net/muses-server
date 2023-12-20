import { Module } from '@nestjs/common';
import { ConfigModule } from '@lib-commons/infrastructure';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { ListEcosystemController, UpdateEcosystemController } from '@app-main/modules/ecosystem/infrastructure';
import { UpdateEcosystemService, ECOSYSTEM_REPOSITORY, ListEcosystemService } from '@app-main/modules/ecosystem/application';
import { EcosystemEntity, TypeOrmMongoEcosystemRepository } from '@app-main/modules/commons/infrastructure';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
    TypeOrmModule.forFeature([EcosystemEntity])
  ],
  controllers: [UpdateEcosystemController, ListEcosystemController],
  providers: [
    UpdateEcosystemService,
    ListEcosystemService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmMongoEcosystemRepository,
    },
  ],
})
export class MainEcosystemServerModule {}
