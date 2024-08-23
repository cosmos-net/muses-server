import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';

interface IError {
  message?: string;
  name?: string;
  status?: number;
}

interface IBodyResponse {
  stack?: string
  error?: IError | string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, string>;

    const { message, error } = exceptionResponse;

    this.logger.error(
      `Http Status: ${status} Error: ${JSON.stringify(exceptionResponse)}} Path: ${request.url} stack ${
        exception.stack
      }`,
    );

    const bodyResponse: IBodyResponse = {
      stack: exception.stack,
      error: {
        message,
        name: error,
        status,
      },
    };

    return throwError(() => bodyResponse);
  }
}
