import { EventStoreService } from '@lib-commons/application/event-store.service';
import { type DynamicModule, Module } from '@nestjs/common';

import {
  ConfigModule as NestConfigModule,
  ConfigService,
  type ConfigFactory,
  type ConfigModuleOptions,
} from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EventStoreService],
})
export class ConfigModule {
  static forFeature(config: ConfigFactory): DynamicModule {
    return {
      imports: [NestConfigModule.forFeature(config)],
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }

  static forRoot(options: ConfigModuleOptions): DynamicModule {
    return {
      imports: [NestConfigModule.forRoot(options)],
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
