// filepath: /Users/robertomedinaaustin/Sites/smi/cosmos/gea-core/muses/muses-server/src/modules/action/infrastructure/framework/hades-connection.module.ts
import { HADES_SERVER_CONNECTION_PROXY_NAME } from '@module-action/application/constants/injection-token';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: HADES_SERVER_CONNECTION_PROXY_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('HADES_SERVER_RABBIT_MQ_URL')].filter((url): url is string => !!url),
            queue: configService.get<string>('HADES_SERVER_RABBIT_MQ_QUEUE_NAME'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [
    ClientsModule.registerAsync([
      {
        name: HADES_SERVER_CONNECTION_PROXY_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('HADES_SERVER_RABBIT_MQ_URL')].filter((url): url is string => !!url),
            queue: configService.get<string>('HADES_SERVER_RABBIT_MQ_QUEUE_NAME'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class HadesConnectionContext {}