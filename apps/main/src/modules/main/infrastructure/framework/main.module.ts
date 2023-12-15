import { ConfigModule } from '@management-commons/infrastructure/framework/common-main.module';
import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@management-main/modules/main/infrastructure/config/options/config.options';
import { MainHealthServerModule } from '@management-main/modules/health/infrastructure/framework/main.module';
import { MainEcosystemServerModule } from '@management-main/modules/ecosystem/infrastructure/framework/ecosystem.module';

@Module({
  imports: [ConfigModule.forRoot(MainConfigOptions), MainHealthServerModule, MainEcosystemServerModule],
})
export class MainModule {}
