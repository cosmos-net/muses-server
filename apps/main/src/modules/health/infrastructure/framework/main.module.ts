import { ConfigModule } from '@management-commons/infrastructure/framework/common-main.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { MainConfigOptions } from '@management-main/modules/main/infrastructure/config/options/config.options';
import { HealthController } from '@management-main/modules/health/infrastructure/controllers/get-health/get-health.controller';
import { ExternalSystemService } from '@management-main/modules/health/infrastructure/domain/external-system.service';
import { GetHealthService } from '@management-main/modules/health/application/use-cases/check-health/get-health.service';
import { EXTERNAL_SYSTEM } from '@management-main/modules/health/application/constants/injection-tokens';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [
    GetHealthService,
    ExternalSystemService,
    {
      provide: EXTERNAL_SYSTEM,
      useClass: ExternalSystemService,
    },
  ],
})
export class MainHealthServerModule {}
