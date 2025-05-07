import { Catch, ArgumentsHost, Logger, ExceptionFilter, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let bodyResponse: IBodyResponse = {
      error: 'Internal Server Error',
    };

    // If already an RpcException, extract the error
    if (exception instanceof RpcException) {
      const error = exception.getError();
      
      bodyResponse = {
        error,
      };

      if (typeof error === 'object') {
        const message = (error as IError).message ?? 'Internal Server Error';
        const name = (error as IError).name ?? 'Error';
        const status = (error as IError).status ?? 500;
        const stack = (error as IBodyResponse).stack ?? '';

        bodyResponse = {
          ...bodyResponse,
          stack,
          error: {
            message,
            name,
            status,
          },
        };
      }
    } 
    // If an HTTP exception, format it appropriately
    else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as Record<string, string>;
      const { message, error } = exceptionResponse;

      bodyResponse = {
        stack: exception.stack,
        error: {
          message,
          name: error,
          status,
        },
      };
    } 
    // For any other type of exception
    else {
      const message = exception.message || 'Internal Server Error';
      const name = exception.name || 'Error';
      const status = exception.status || 500;

      bodyResponse = {
        stack: exception.stack,
        error: {
          message,
          name,
          status,
        },
      };
    }

    // If we're in an HTTP context
    if (host.getType() === 'http') {
      try {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        this.logger.error(
          `Http Status: ${(bodyResponse.error as IError)?.status || 500} Error: ${JSON.stringify(bodyResponse)} Path: ${request.url}`,
        );
      } catch (error) {
        this.logger.error(`Failed to log HTTP error details: ${error.message}`);
      }
    } else {
      // RPC or other context
      this.logger.error(`Error: ${JSON.stringify(bodyResponse)}`);
    }

    // Convert all exceptions to RpcException for consistency in microservice responses
    if (!(exception instanceof RpcException)) {
      exception = new RpcException(bodyResponse.error ?? 'Internal Server Error');
    }

    return throwError(() => bodyResponse);
  }
}
