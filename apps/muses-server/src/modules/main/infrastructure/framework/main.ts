import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, HttpException, BadRequestException, Logger, ValidationError } from '@nestjs/common';
import { ServerConfigType } from '@management-commons/domain/contracts/server.type';
import { MainModule } from '@management-main/modules/main/infrastructure/framework/main.module';
import { HttpExceptionFilter } from '@management-main/modules/main/infrastructure/framework/http-exception.filter';
import { TransformInterceptor } from '@management-main/modules/main/infrastructure/framework/transform.interceptor';
import { ConfigLoaderType } from '@management-commons/domain/contracts/config-loader.type';

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

  const { port, applicationName } = configService.get<ServerConfigType>('server');
  const { clientURL } = configService.get<ConfigLoaderType>('server');

  app.enableCors({
    origin: clientURL,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });
  
  await app.listen(port, () => Logger.log(`Running on port ${port}`, applicationName));
}

bootstrap();
