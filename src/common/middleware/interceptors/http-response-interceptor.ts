import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import RestResponse from 'src/common/dto/rest-response.dto';
import { MimeType } from 'src/constants/common.enum';

@Injectable()
export class ResponseMiddleware {
  logger: Logger;

  constructor(@Inject(Logger.name) logger: Logger) {
    this.logger = logger;
  }

  successHandler(options: SuccessResponseMiddlewareOptions): RestResponse {
    if (MimeType.TEXT === options.response?.headers?.mimeType) {
      return options.response;
    }
    return options.callback(options.response);
  }
  failureHandler(options: FailureResponseMiddlewareOptions) {
    this.logger.error(options.error?.stack);
    this.logger.log('FailureResponseMiddleware', options.error);

    if (options.error?.config || options.error?.response) {
      options.error.status = options.error?.response?.status;
      options.error.message =
        options?.error?.message && options?.error?.message?.message
          ? options.error.message.message
          : options?.error?.message;
      options.error.errorData =
        options?.error?.message && options?.error?.message?.errorData
          ? options.error.message.errorData
          : null;
      this.logger.error({
        url: options.error?.config?.url,
        status: options.error?.response?.status,
        response: options.error?.response?.data,
        message:
          options?.error?.message && options?.error?.message?.message
            ? options.error.message.message
            : options?.error?.message,
        errorData:
          options?.error?.message && options?.error?.message?.errorData
            ? options.error.message.errorData
            : null,
      });
    }
    if (options.error?.message === 'Bad Request Exception') {
      this.logger.error(options.error?.response);
      return options.callback(options.error?.response);
    }
    return options.callback(options.error);
  }
}

@Injectable()
export default class HttpResponseInterceptor implements NestInterceptor {
  constructor(private responseMiddleware: ResponseMiddleware) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map((apiResponse: RestResponse) =>
        this.responseMiddleware.successHandler({
          response: apiResponse,
          callback: this.successCallbackCreator(response),
        }),
      ),
      catchError((error: any) => {
        return this.responseMiddleware.failureHandler({
          error,
          callback: this.failureCallback,
        });
      }),
    );
  }

  private successCallbackCreator(response: any) {
    return (apiResponse: RestResponse) => {
      response.status(
        apiResponse?.status || HttpStatus.OK || HttpStatus.NO_CONTENT,
      );
      return { data: apiResponse?.data || apiResponse, is_success: true };
    };
  }

  private async failureCallback(error: any) {
    const status =
      error.status ||
      error?.statusCode ||
      error?.response?.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    const { message, errorData } = await parseErrorJson(error);
    throw new HttpException(
      {
        error: {
          statusCode: status,
          message: message,
          errorData: errorData,
          code: error?.code,
        },

        is_success: false,
      },
      status,
    );
  }
}

export function parseErrorJson(error: any) {
  try {
    return {
      message: JSON.parse(error?.message).message,
      errorData: JSON.parse(error?.message).errorData,
    };
  } catch (err) {
    return { message: error?.message };
  }
}

export interface SuccessResponseMiddlewareOptions {
  response: RestResponse;
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function;
}
export interface FailureResponseMiddlewareOptions {
  error: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function;
}
