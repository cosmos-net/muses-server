import { Module } from '@nestjs/common';
import { ConfigModule } from '@management-commons/infrastructure/framework/common-main.module';
import { MainConfigOptions } from '@management-main/modules/main/infrastructure/config/options/config.options';
import { EcosystemController } from '@management-main/modules/ecosystem/infrastructure/controllers/update-ecosystem/update-ecosystem.controller';
import { UpdateEcosystemService } from '@management-main/modules/ecosystem/application/use-cases/update-ecosystem.service';
import { ECOSYSTEM_REPOSITORY } from '@management-main/modules/ecosystem/application/constants/injection-token';
import { TypeOrmMongoEcosystemRepository } from '@management-main/modules/commons/infrastructure/repositories/typeorm-mongo-ecosystem.repository';

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
