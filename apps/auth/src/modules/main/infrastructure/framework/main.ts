import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, HttpException, BadRequestException, Logger, ValidationError } from '@nestjs/common';
import { AuthMainModule } from '@app-auth/modules/main/infrastructure/framework/auth-main.module';
import { ClientType, ServerAuthType } from '@lib-commons/domain';
import { HttpExceptionFilter } from '@lib-commons/infrastructure/framework/http-exception.filter';
import { TransformInterceptor } from '@lib-commons/infrastructure/framework/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthMainModule);

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

  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const serverAuth = configService.get<ServerAuthType>('auth') as ServerAuthType;
  if (!serverAuth) {
    throw new Error('Server auth is not defined');
  }

  const client = configService.get<ClientType>('client');
  if (!client) {
    throw new Error('Client is not defined');
  }

  // TODO: separate cors config
  app.enableCors({
    origin: `${client.protocol}://${client.host}:${client.port}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  await app.listen(serverAuth.port, () => Logger.log(`Running on port ${serverAuth.port}`, serverAuth.name));
}

bootstrap();
