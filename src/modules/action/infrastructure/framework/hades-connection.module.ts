import { HADES_SERVER_CONNECTION_PROXY_NAME } from '@module-action/application/constants/injection-token';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:
  [
    ClientsModule.register(
    [
      {
        name: HADES_SERVER_CONNECTION_PROXY_NAME,
        transport: Transport.RMQ,
        options:
        {
          urls: process.env.HADES_SERVER_RABBIT_MQ_URL ? [process.env.HADES_SERVER_RABBIT_MQ_URL] : [],
          queue: process.env.HADES_SERVER_RABBIT_MQ_QUEUE_NAME,
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
  ],
  exports: [
    ClientsModule.register(
      [
        {
          name: HADES_SERVER_CONNECTION_PROXY_NAME,
          transport: Transport.RMQ,
          options:
          {
            urls: process.env.HADES_SERVER_RABBIT_MQ_URL ? [process.env.HADES_SERVER_RABBIT_MQ_URL] : [],
            queue: process.env.HADES_SERVER_RABBIT_MQ_QUEUE_NAME,
            queueOptions: {
              durable: false
            }
          }
        }
      ]),
  ]
})
export class HadesConnectionModule {}