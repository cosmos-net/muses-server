import { BadRequestException, HttpException, ValidationError, ValidationPipe } from '@nestjs/common';

export class ValidationPipeWithExceptionFactory extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]): HttpException => {
        const errorMapped = errors.map((error) => {
          return {
            field: error.property,
            constraints: error.constraints,
          };
        });

        return new BadRequestException(errorMapped);
      },
    });
  }
}
