import { ConfigModule } from '@management-commons/infrastructure/framework/common-main.module';
import { Module } from '@nestjs/common';
import { MainConfigOptions } from '@management-main/modules/main/infrastructure/config/options/config.options';
import { MusesServerModule } from '@management-main/modules/health/infrastructure/framework/muses-server.module';

@Module({
  imports: [
    ConfigModule.forRoot(MainConfigOptions),
    MusesServerModule
  ],
})
export class MainModule {}
