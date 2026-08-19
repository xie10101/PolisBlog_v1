import { Injectable, Logger } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject } from "@nestjs/common";
import { Logger as WinstonLogger } from "winston";
// 模块中提取Logger？
@Injectable()
export class AppLoggerService {
  constructor(
    //  provider - 默认标识字符
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
  ) {}

  // 通用日志方法，携带请求ID
  log(message: string, reqId?: string) {
    this.winstonLogger.info(message, { reqId });
  }

  debug(message: string, reqId?: string) {
    this.winstonLogger.debug(message, { reqId });
  }

  warn(message: string, reqId?: string) {
    this.winstonLogger.warn(message, { reqId });
  }

  error(message: string, stack?: string, reqId?: string) {
    this.winstonLogger.error(message, { stack, reqId });
  }
}
