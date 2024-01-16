import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionManager extends HttpException {
  static httpType: keyof typeof HttpStatus;

  constructor(message: string, type: keyof typeof HttpStatus) {
    const httpStatusParam = HttpStatus[type];

    super(message, httpStatusParam);
    ExceptionManager.httpType = type;
  }

  public static createSignatureError(messageOrPayload: string | Record<string, unknown>): HttpException {
    let httpStatus: HttpStatus | number = HttpStatus[this.httpType] || HttpStatus.INTERNAL_SERVER_ERROR;

    if (messageOrPayload instanceof Object) {
      const status = messageOrPayload.status as any;

      if (status in HttpStatus) {
        httpStatus = status;
      }
    }

    return new HttpException(messageOrPayload, httpStatus);
  }

  public static badRequest(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.BAD_REQUEST);
  }

  public static unauthorized(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.UNAUTHORIZED);
  }

  public static forbidden(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.FORBIDDEN);
  }

  public static notFound(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.NOT_FOUND);
  }

  public static conflict(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.CONFLICT);
  }

  public static unprocessableEntity(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  public static internalServerError(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public static serviceUnavailable(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.SERVICE_UNAVAILABLE);
  }

  public static badGateway(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.BAD_GATEWAY);
  }

  public static gatewayTimeout(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.GATEWAY_TIMEOUT);
  }

  public static tooManyRequests(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.TOO_MANY_REQUESTS);
  }

  public static notImplemented(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.NOT_IMPLEMENTED);
  }

  public static notAcceptable(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.NOT_ACCEPTABLE);
  }

  public static requestTimeout(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.REQUEST_TIMEOUT);
  }

  public static lengthRequired(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.LENGTH_REQUIRED);
  }

  public static preconditionFailed(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.PRECONDITION_FAILED);
  }

  public static payloadTooLarge(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.PAYLOAD_TOO_LARGE);
  }

  public static uriTooLong(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.URI_TOO_LONG);
  }

  public static unsupportedMediaType(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }

  public static failedDependency(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.FAILED_DEPENDENCY);
  }

  public static preconditionRequired(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.PRECONDITION_REQUIRED);
  }

  public static requestRangeNoSatisfiable(messageOrPayload: string | Record<string, unknown>): HttpException {
    return new HttpException(messageOrPayload, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
  }
}
