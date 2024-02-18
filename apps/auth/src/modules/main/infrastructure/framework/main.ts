import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AuthMainModule } from '@app-auth/modules/main/infrastructure/framework/auth-main.module';
import { HttpExceptionFilter } from '@lib-commons/infrastructure/framework/http-exception.filter';
import { TransformInterceptor } from '@lib-commons/infrastructure/framework/transform.interceptor';
import { ValidationPipeWithExceptionFactory } from '@lib-commons/infrastructure/framework/global-validation.pipe';
import { ServerAuthType } from '@lib-commons/domain/contracts/types/var-environment-map/servers/server-auth.type';
import { ClientType } from '@lib-commons/domain/contracts/types/var-environment-map/client/client.type';

async function bootstrap() {
  const app = await NestFactory.create(AuthMainModule);

  const configService = app.get(ConfigService);
  const serverAuth = configService.get<ServerAuthType>('auth');
  const client = configService.get<ClientType>('client');

  if (!serverAuth) {
    throw new Error('Server is not defined');
  }

  if (!client) {
    throw new Error('Client is not defined');
  }

  app.useGlobalPipes(new ValidationPipeWithExceptionFactory(), new ValidationPipe({ forbidUnknownValues: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: `${client.protocol}://${client.host}:${client.port}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  await app.listen(serverAuth.port, () => Logger.log(`Running on port ${serverAuth.port}`, serverAuth.name));
}

bootstrap();
