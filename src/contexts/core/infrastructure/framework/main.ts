import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MainModule } from '@core/infrastructure/framework/main.module';
import { TransformInterceptor } from '@core/infrastructure/framework/transform.interceptor';
import { ValidationPipeWithExceptionFactory } from '@core/infrastructure/framework/global-validation.pipe';
import { GlobalExceptionFilter } from '@core/infrastructure/framework/global-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const natsURL = process.env.NATS_URL;

  if (!natsURL) {
    throw new Error('NATS_URL is not defined');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MainModule, {
    transport: Transport.NATS,
    options: {
      servers: [natsURL],
    },
  });

  app.useGlobalPipes(new ValidationPipeWithExceptionFactory(), new ValidationPipe({ forbidUnknownValues: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen();
}

bootstrap();
