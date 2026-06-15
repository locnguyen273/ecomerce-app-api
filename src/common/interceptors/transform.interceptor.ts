import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((res: ApiResponse<T> | T) => {
        return {
          success: true,
          data: this.extractData(res),
        };
      }),
    );
  }

  private extractData(res: ApiResponse<T> | T): any {
    if (typeof res === 'object' && res !== null && 'data' in res && 'message' in res) {
      return (res).data;
    }
    return res;
  }
}
