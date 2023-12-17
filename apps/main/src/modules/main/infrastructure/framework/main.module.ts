import { ConfigModule } from '@lib-commons/infrastructure';
import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@app-main/modules/main/infrastructure';
import { MainHealthServerModule } from '@app-main/modules/health/infrastructure';
import { MainEcosystemServerModule } from '@app-main/modules/ecosystem/infrastructure';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), MainHealthServerModule, MainEcosystemServerModule],
})
export class MainModule {}
