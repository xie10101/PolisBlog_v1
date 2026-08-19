import { Module, Global } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "./logger.config";
import { AppLoggerService } from "./logger.service";
@Global()
@Module({
  imports: [
    // 全局注册Winston日志 - 配置项注册
    WinstonModule.forRoot(loggerConfig),
  ],
  providers: [AppLoggerService],
  exports: [WinstonModule, AppLoggerService],
})
export class LoggerModule {}

/**
 *
 * @global()
 * @Global() 只省 第③步（免去每个模块手动 imports），
 * 不省 exports。它做的事是：把这个模块的 exports 注册到根容器，让所有模块无需 import 也能注入。
 */
