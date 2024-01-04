import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, HttpException, BadRequestException, Logger, ValidationError } from '@nestjs/common';
import { MainModule } from '@app-main/modules/main/infrastructure';
import { ClientType, ServerMainType } from '@lib-commons/domain';
import { TransformInterceptor } from '@lib-commons/infrastructure/framework/transform.interceptor';
import { HttpExceptionFilter } from '@lib-commons/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

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

  const serverMain = configService.get<ServerMainType>('main') as ServerMainType;
  if (!serverMain) {
    throw new Error('Server main is not defined');
  }

  const client = configService.get<ClientType>('client');
  if (!client) {
    throw new Error('Client is not defined');
  }

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: `${client.protocol}://${client.host}:${client.port}`,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  await app.listen(serverMain.port, () => Logger.log(`Running on port ${serverMain.port}`, serverMain.name));
}

bootstrap();
