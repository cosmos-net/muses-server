import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MainModule } from '@core/infrastructure/framework/main.module';
import { ClientType } from '@core/domain/contracts/types/var-environment-map/client/client.type';
import { ServerMainType } from '@core/domain/contracts/types/var-environment-map/servers/server-main.type';
import { TransformInterceptor } from '@core/infrastructure/framework/transform.interceptor';
import { ValidationPipeWithExceptionFactory } from '@core/infrastructure/framework/global-validation.pipe';
import { HttpExceptionFilter } from '@core/infrastructure/framework/http-exception.filter';
// import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService = app.get(ConfigService);
  const client = configService.get<ClientType>('client');
  const serverMain = configService.get<ServerMainType>('main');

  if (!serverMain) {
    throw new Error('Server main is not defined');
  }

  if (!client) {
    throw new Error('Client is not defined');
  }

  app.useGlobalPipes(new ValidationPipeWithExceptionFactory(), new ValidationPipe({ forbidUnknownValues: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  app.setGlobalPrefix('api/v1/muses-management/');

  app.enableCors({
    origin: `${client.protocol}://${client.host}:${client.port}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  await app.listen(serverMain.port, () => Logger.log(`Running on port ${serverMain.port}`, serverMain.name));
}

bootstrap();
