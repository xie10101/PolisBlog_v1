import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject } from "@nestjs/common";
import { Logger } from "winston";
import { Request, Response } from "express";
import { Result } from "../dto/result.dto";
import { BizCode } from "../constants/business-code";
import { BusinessException } from "../exceptions/business.exception";

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
    let message: string = BizCode.INTERNAL_ERROR.message;
    let stack = "";

    // 按优先级解析业务码与消息
    if (exception instanceof BusinessException) {
      status = exception.biz.code;
      message = exception.biz.message;
    } else if (exception instanceof HttpException) {
      // 处理HTTP异常
      status = exception.getStatus(); // 私密封装
      const errRes = exception.getResponse();
      message = typeof errRes === "string" ? errRes : (errRes as any).message ?? message;
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
      new Date().toISOString(),
    );

    // 统一返回格式
    response.status(status).json(Result.fail(status, message));
  }
}

// 请求异常过滤器- 对捕获到的异常-依据类型不同设置不同的消息类型 


// 过滤器 - 守卫 - 管道 - 策略 - 中间件 - 装饰器  - 拦截器
