import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  ValidationPipe,
  HttpException,
  BadRequestException,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { AuthMainModule, HttpExceptionFilter, TransformInterceptor } from '@app-auth/modules/main/infrastructure';
import { ClientType } from '@lib-commons/domain/contracts/types/var-environment-map/client/client.type';
import { ServerAuthType } from '@lib-commons/domain/contracts/types/var-environment-map/servers/server-auth.type';

async function bootstrap() {
  const app = await NestFactory.create(AuthMainModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]): HttpException => {
        const err = errors.map((error) => ({
          [error.property]: Object.keys(
            error.constraints as {
              [type: string]: string;
            },
          ),
        }));

        throw new BadRequestException(err);
      },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1');

  const configService: ConfigService = app.get(ConfigService);

  const serverAuth = configService.get<ServerAuthType>(
    'auth',
  ) as ServerAuthType;
  const client = configService.get<ClientType>('client');

  // TODO: Validate origin of client
  if (!client) {
    throw new Error('Client is not defined');
  }
  app.enableCors({
    origin: `${client.protocol}://${client.host}:${client.port}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  if (!serverAuth) {
    throw new Error('Server auth is not defined');
  }

  await app.listen(serverAuth.port, () =>
    Logger.log(`Running on port ${serverAuth.port}`, serverAuth.name),
  );
}

bootstrap();
