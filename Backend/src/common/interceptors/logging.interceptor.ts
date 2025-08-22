import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = request;
    const now = Date.now();

    this.logger.log(`Request: ${method} ${url}`);
    this.logger.debug(`Body: ${JSON.stringify(body)}`);
    this.logger.debug(`Params: ${JSON.stringify(params)}`);
    this.logger.debug(`Query: ${JSON.stringify(query)}`);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;

        this.logger.log(
          `Response: ${method} ${url} - Status: ${response.statusCode} - Time: ${delay}ms`,
        );
        this.logger.debug(
          `Response data: ${JSON.stringify(data).substring(0, 500)}...`,
        );
      }),
    );
  }
}
