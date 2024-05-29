import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MainModule } from '@core/infrastructure/framework/main.module';
import { ClientType } from '@core/domain/contracts/types/var-environment-map/client/client.type';
import { ServerMainType } from '@core/domain/contracts/types/var-environment-map/servers/server-main.type';
import { TransformInterceptor } from '@core/infrastructure/framework/transform.interceptor';
import { ValidationPipeWithExceptionFactory } from '@core/infrastructure/framework/global-validation.pipe';
import { HttpExceptionFilter } from '@core/infrastructure/framework/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService = app.get(ConfigService);
  const client = configService.get<ClientType>('client');
  const server = configService.get<ServerMainType>('main');

  if (!server) {
    throw new Error('Server main is not defined');
  }

  if (!client) {
    throw new Error('Client is not defined');
  }

  app.useGlobalPipes(new ValidationPipeWithExceptionFactory(), new ValidationPipe({ forbidUnknownValues: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  app.setGlobalPrefix('api/v1/muses-management/');

  const origin = server.host === '127.0.0.1' ? `${client.protocol}://${client.host}:${client.port}` : `${client.protocol}://${client.host}`;

  app.enableCors({
    origin,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  const port = process.env.PORT ?? server.port;

  await app.listen(port, () => Logger.log(`Running on port ${port}`, server.name));
}

bootstrap();
