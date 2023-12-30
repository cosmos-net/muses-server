import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, string>;

    let error = '';
    let data = '';

    if (typeof exceptionResponse === 'object') {
      error = exceptionResponse.error;
      data = exceptionResponse.message;
    } else {
      error = exceptionResponse;
      data = exception.message;
    }

    response.status(status).json({
      error,
      data,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
