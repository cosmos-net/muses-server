import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly config: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, string>;
    const isProduction = this.config.get<string>('servers.serverEnv') === 'production';

    const { message, error } = exceptionResponse;

    this.logger.error(
      `Http Status: ${status} Error: ${JSON.stringify(exceptionResponse)}} Path: ${request.url} stack ${
        exception.stack
      }`,
    );

    response.status(status).json({
      statusCode: status,
      errors: {
        error,
        message,
      },
      data: {},
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(!isProduction && { stack: exception.stack }),
    });
  }
}
