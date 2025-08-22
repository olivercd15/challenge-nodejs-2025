import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: Date;
  path: string;
  method: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = this.getStatusCode(context, data);
        const message = this.getMessage(context, data, statusCode);
        response.status(statusCode);

        return {
          success: this.isSuccess(statusCode),
          statusCode: statusCode,
          message: message,
          data: data,
          timestamp: new Date(),
          path: request.url,
          method: request.method,
        };
      }),
    );
  }

  private getStatusCode(context: ExecutionContext, data: any): number {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (response.statusCode !== HttpStatus.OK) {
      return response.statusCode;
    }

    switch (request.method) {
      case 'POST':
        return data ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
      case 'DELETE':
        return data === null || data === undefined
          ? HttpStatus.NO_CONTENT
          : HttpStatus.OK;
      case 'GET':
        return data ? HttpStatus.OK : HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.OK;
    }
  }

  private isSuccess(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }

  private getMessage(
    context: ExecutionContext,
    data: any,
    statusCode: number,
  ): string {
    const request = context.switchToHttp().getRequest();

    if (!this.isSuccess(statusCode)) {
      return this.getErrorMessage(statusCode);
    }

    switch (request.method) {
      case 'GET':
        return data ? 'Data obtained' : 'Not found data';
      case 'POST':
        return 'Created successful';
      case 'PUT':
      case 'PATCH':
        return 'Updated successful';
      case 'DELETE':
        return 'Deleted successfule';
      default:
        return 'Operation successful';
    }
  }

  private getErrorMessage(statusCode: number): string {
    const errorMessages: { [key: number]: string } = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
      [HttpStatus.GATEWAY_TIMEOUT]: 'GATEWAY_TIMEOUT',
    };

    return errorMessages[statusCode] || 'UNKNOWN ERROR';
  }
}
