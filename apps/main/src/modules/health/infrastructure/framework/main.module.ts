import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from '@app-main/modules/health/infrastructure/controllers/get-health/get-health.controller';
import { GetHealthService } from '@app-main/modules/health/application/use-cases/check-health/get-health.service';
import { ExternalSystemService } from '@app-main/modules/health/infrastructure/domain/external-system.service';
import { EXTERNAL_SYSTEM } from '@app-main/modules/health/application/constants/injection-tokens';

@Module({
  imports: [TerminusModule, HttpModule],
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
export class MainHealthModule {}
