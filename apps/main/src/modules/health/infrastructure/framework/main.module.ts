import { ConfigModule } from '@lib-commons/infrastructure';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { HealthController, ExternalSystemService } from '@app-main/modules/health/infrastructure';
import { GetHealthService, EXTERNAL_SYSTEM } from '@app-main/modules/health/application';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), TerminusModule, HttpModule],
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
