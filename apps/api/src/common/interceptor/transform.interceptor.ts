// src/common/interceptor/transform.interceptor.ts
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Result } from "../dto/result.dto";

export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Result<T>> {
    //前置逻辑
    //下面是请求流的处理
    return next.handle().pipe(
      map((data) => {
        // 自动包装成功响应
        return Result.success(data);
      }),
    );
  }
}
//后置拦截器
