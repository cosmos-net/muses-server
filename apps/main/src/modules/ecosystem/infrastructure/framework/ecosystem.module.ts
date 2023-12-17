import { Module } from '@nestjs/common';
import { ConfigModule } from '@lib-commons/infrastructure';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { EcosystemController } from '@app-main/modules/ecosystem/infrastructure';
import { UpdateEcosystemService, ECOSYSTEM_REPOSITORY } from '@app-main/modules/ecosystem/application';
import { TypeOrmMongoEcosystemRepository } from '@app-main/modules/commons/infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
  ],
  controllers: [EcosystemController],
  providers: [
    UpdateEcosystemService,
    {
      provide: ECOSYSTEM_REPOSITORY,
      useClass: TypeOrmMongoEcosystemRepository,
    },
  ],
})
export class MainEcosystemServerModule {}
