# NestJS 框架日志管理生产级实践方案

在 NestJS 项目开发及生产部署中，日志是问题排查、链路追踪、性能分析、业务监控的核心依据。原生 Nest 日志功能简单、无持久化、无分级管控、不支持日志切割，无法满足生产环境需求。本文基于 **Winston \+ nest\-winston** 实现一套标准化、可扩展、高性能的日志管理方案，包含日志分级、文件持久化、按天切割、错误日志单独存储、控制台美化、链路追踪、全局异常捕获、生产环境优化等全能力。

## 一、方案选型与核心设计思路

### 1\.1 技术选型

- **nest\-winston**：NestJS 官方推荐的 Winston 日志适配模块，无缝整合 Nest 生命周期

- **winston**：Node\.js 主流日志库，支持自定义格式、多传输通道、日志分级

- **winston\-daily\-rotate\-file**：日志按日期切割插件，解决单日志文件过大、日志堆积问题

### 1\.2 核心设计目标

- **分级日志**：区分 debug、info、warn、error 级别，环境差异化输出

- **日志持久化**：日志落地文件，不依赖控制台输出

- **自动切割归档**：按天分割日志，自动清理过期日志，释放磁盘空间

- **分类存储**：正常日志、错误日志分开存储，便于问题快速排查

- **链路追踪**：集成请求 ID，贯穿单次 HTTP 请求全生命周期日志

- **全局统一输出**：统一业务日志、异常日志、框架原生日志格式

- **环境适配**：开发环境控制台美化输出，生产环境精简结构化日志

## 二、环境依赖安装

安装核心日志依赖包，适配 NestJS 全版本：

```bash
# 核心日志库
npm install winston nest-winston
# 日志按天切割插件
npm install winston-daily-rotate-file
# 类型声明（TS 项目必备）
npm install -D @types/winston
```

## 三、核心日志模块封装（可复用全局模块）

在项目 `src/common/logger` 目录下新建日志配置文件，封装全局日志模块，支持全局注入使用。

### 3\.1 日志配置文件 logger\.config\.ts

统一配置日志格式、切割规则、存储路径、级别控制，区分开发/生产环境：

```typescript
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LoggerOptions } from 'winston';

// 日志存储根目录
const LOG_DIR = process.cwd() + '/logs';
// 日志输出格式：时间 + 级别 + 请求ID + 日志内容
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }), // 捕获错误堆栈信息
  format.printf((info) => {
    return `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.reqId || ''}: ${info.message} ${info.stack || ''}`;
  }),
);

// 开发环境控制台彩色输出
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    return `[${info.timestamp}] [${info.level}] ${info.reqId || ''}: ${info.message} ${info.stack || ''}`;
  }),
);

// 通用日志传输配置
export const loggerConfig: LoggerOptions = {
  // 全局日志级别：开发环境debug，生产环境info
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // 1. 普通日志文件：按天切割，存储info及以下级别日志
    new transports.DailyRotateFile({
      filename: `${LOG_DIR}/info/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '20m', // 单文件最大20MB
      maxFiles: '14d', // 保留14天日志
      zippedArchive: true, // 过期日志压缩归档
    }),
    // 2. 错误日志文件：单独存储error级别日志
    new transports.DailyRotateFile({
      filename: `${LOG_DIR}/error/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d', // 错误日志保留30天
      zippedArchive: true,
    }),
  ],
};

// 开发环境追加控制台输出
if (process.env.NODE_ENV !== 'production') {
  loggerConfig.transports.push(
    new transports.Console({
      format: consoleFormat,
    }),
  );
}
```

### 3\.2 全局日志模块 logger\.module\.ts

封装全局日志模块，实现全局可注入、统一替换 Nest 原生日志：

```typescript
import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './logger.config';

@Global()
@Module({
  imports: [
    // 全局注册Winston日志
    WinstonModule.forRoot(loggerConfig),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
```

### 3\.3 全局日志工具类 logger\.service\.ts（可选增强）

封装统一日志调用方法，支持自定义请求ID、业务参数打印：

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class AppLoggerService {
  constructor(
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
```

## 四、全局请求链路追踪（绑定请求ID）

通过全局中间件为每一次 HTTP 请求生成唯一 ID，绑定到当前请求所有日志，实现链路追踪。新建 `src/common/middleware/req-id.middleware.ts`：

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

declare global {
  namespace Express {
    interface Request {
      reqId: string;
    }
  }
}

@Injectable()
export class ReqIdMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 生成唯一请求ID
    req.reqId = randomUUID().slice(0, 16);
    // 挂载日志自定义字段
    this.logger.defaultMeta = { reqId: req.reqId };
    next();
  }
}
```

在根模块 `app.module.ts` 注册中间件：

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { ReqIdMiddleware } from './common/middleware/req-id.middleware';

@Module({
  imports: [LoggerModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqIdMiddleware).forRoutes('*');
  }
}
```

## 五、全局异常日志统一捕获

通过 Nest 全局异常过滤器，统一捕获 HTTP 异常、系统异常，标准化打印错误日志，避免日志散落、丢失。新建 `src/common/filter/http-exception.filter.ts`：

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { Request, Response } from 'express';

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
    let message = '服务器内部错误';
    let stack = '';

    // 处理HTTP异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errRes = exception.getResponse();
      message = typeof errRes === 'string' ? errRes : (errRes as any).message;
    } else if (exception instanceof Error) {
      // 处理系统异常
      stack = exception.stack || '';
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
```

在 `main.ts` 全局注册过滤器，并替换 Nest 原生日志：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filter/http-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局注册异常过滤器
  app.useGlobalFilters(new AllExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)));
  
  // 替换Nest原生日志为Winston日志
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger(logger);

  await app.listen(3000);
}
bootstrap();
```

## 六、业务日志使用方式

### 6\.1 基础注入使用

```typescript
import { Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getUserInfo() {
    // 业务正常日志
    this.logger.info('查询用户信息成功');
    // 业务警告日志
    this.logger.warn('用户访问频率过高');
    // 业务错误日志
    this.logger.error('查询用户信息失败', new Error('数据库查询异常').stack);
    return null;
  }
}
```

### 6\.2 简化工具类使用

注入自定义的 `AppLoggerService`，无需手动传请求ID，自动绑定：

```typescript
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from './common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: AppLoggerService) {}

  login() {
    this.logger.log('用户登录成功');
    this.logger.debug('登录参数校验通过');
  }
}
```

## 七、生产环境日志优化策略

### 7\.1 日志级别管控

- 开发环境：`debug` 级别，打印详细调试日志、参数信息

- 生产环境：`info` 级别，关闭冗余 debug 日志，减少磁盘 IO

### 7\.2 日志切割与清理

- 按天自动分割日志文件，避免单文件超大导致读取卡顿

- 普通日志保留14天，错误日志保留30天，自动删除过期文件

- 开启日志压缩，过期日志自动打包，节省磁盘空间

- 单文件上限20MB，防止单个日志文件过大影响读写性能

### 7\.3 性能优化

- 关闭生产环境控制台日志输出，仅保留文件持久化，减少性能损耗

- 日志异步写入，不阻塞业务请求流程

- 禁止打印敏感数据（密码、token、手机号），可通过自定义格式化过滤

### 7\.4 日志规范化

- 所有日志携带：时间、级别、请求ID、堆栈信息、请求路径

- 错误日志强制记录堆栈，便于精准定位代码报错位置

- 业务日志语义化，避免无意义日志输出

## 八、日志排查与进阶扩展

### 8\.1 日志查询技巧

- 按日期查询：直接读取 `logs/info/2025-01-01.log` 对应文件

- 精准排查错误：优先查看 `logs/error/` 目录日志

- 链路追踪：通过唯一 `reqId` 筛选单次请求所有日志

### 8\.2 进阶扩展方案

1. **日志脱敏**：自定义日志格式化函数，自动过滤手机号、身份证、密码等敏感字段

2. **日志推送**：对接 ELK、Grafana Loki、阿里云日志服务，实现日志可视化、检索、告警

3. **定时日志分析**：结合脚本定时统计错误日志数量，异常时触发钉钉/企业微信告警

4. **慢请求日志**：封装请求耗时中间件，记录响应超时的请求日志

## 九、常见问题解决

- **日志目录不存在报错**：项目启动前自动创建 `logs/info`、`logs/error` 目录，可通过 `fs.mkdirSync` 自动创建

- **日志重复打印**：检查是否重复注册日志模块、重复开启控制台输出

- **生产日志无堆栈信息**：确保配置 `format.errors({ stack: true })`

- **请求ID不生效**：确认中间件注册在全局路由、过滤器正常挂载

## 十、方案总结

本套 NestJS 日志方案基于行业主流技术栈，实现了**标准化、自动化、可追溯、高性能**的日志管理能力，完全适配生产环境。解决了原生日志无持久化、无分级、无切割、无法排查链路问题的痛点，同时具备良好的扩展性，可快速对接日志监控系统，是 NestJS 项目通用的最佳实践方案。

> (Note: May contain AI-generated content.)
