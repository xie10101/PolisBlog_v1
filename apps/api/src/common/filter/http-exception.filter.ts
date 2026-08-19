import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject } from "@nestjs/common";
import { Logger } from "winston";
import { Request, Response } from "express";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "服务器内部错误";
    let stack = "";

    // 处理HTTP异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errRes = exception.getResponse();
      message = typeof errRes === "string" ? errRes : (errRes as any).message;
    } else if (exception instanceof Error) {
      // 处理系统异常
      stack = exception.stack || "";
      message = exception.message;
    }

    // 统一记录错误日志（携带请求ID）
    this.logger.error(
      `请求异常：${request.method} ${request.url}，错误信息：${message}`,
      stack,
      request.reqId,
    );

    // 统一返回格式
    response.status(status).json({
      code: status,
      message,
      reqId: request.reqId,
      timestamp: new Date().toISOString(),
    });
  }
}


// 过滤器 - 守卫 - 管道 - 策略 - 中间件 - 装饰器  - 拦截器 