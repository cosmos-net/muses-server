import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
  statusCode: number;
  error: string | null;
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();

        if (data === undefined) {
          response.status(204);
          return undefined as unknown as IResponse<T>;
        }
        if (data === null) {
          response.status(404);
          return undefined as unknown as IResponse<T>;
        }

        return {
          statusCode: response.statusCode,
          error: null,
          data,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
        } as IResponse<T>;
      }),
    );
  }
}
