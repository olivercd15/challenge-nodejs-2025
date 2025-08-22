import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();

        console.error('🚨 Error occurred:', {
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          statusCode: error.status,
          errorMessage: error.message,
          stack: error.stack,
        });

        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
          success: false,
          statusCode: statusCode,
          message: error.message,
          error: error.name,
          timestamp: new Date(),
          path: request.url,
          method: request.method,
        };

        response.status(statusCode);

        return throwError(() => errorResponse);
      }),
    );
  }
}
