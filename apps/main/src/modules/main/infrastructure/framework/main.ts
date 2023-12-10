import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  ValidationPipe,
  HttpException,
  BadRequestException,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { ServerType } from '@management-commons/domain/contracts/types/server/server.type';
import { MainModule } from '@management-main/modules/main/infrastructure/framework/main.module';
import { HttpExceptionFilter } from '@management-main/modules/main/infrastructure/framework/http-exception.filter';
import { TransformInterceptor } from '@management-main/modules/main/infrastructure/framework/transform.interceptor';
import { ClientType } from '@management-commons/domain/contracts/types/client/client.type';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

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

  // TODO: Server and client no undefined
  const server = configService.get<ServerType>('server');
  const client = configService.get<ClientType>('client');

  // TODO: Validate origin of client
  if (client) {
    app.enableCors({
      origin: `${client.protocol}://${client.host}:${client.port}`,
      methods: 'GET,POST,PUT,DELETE,PATCH',
      credentials: true,
    });
  }

  if (server) {
    await app.listen(server.port, () =>
      Logger.log(`Running on port ${server.port}`, server.name),
    );
  }
}

bootstrap();
