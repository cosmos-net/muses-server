import { Catch, ArgumentsHost, Logger, RpcExceptionFilter } from '@nestjs/common';

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

@Catch(RpcException)
export class MicroserviceExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(MicroserviceExceptionFilter.name);

  catch(exception: RpcException, _host: ArgumentsHost): Observable<any> {
    const error = exception.getError();

    let bodyResponse: IBodyResponse = {
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

    this.logger.error(`Error: ${JSON.stringify(bodyResponse)}`);
    return throwError(() => bodyResponse);
  }
}
