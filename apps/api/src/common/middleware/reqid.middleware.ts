import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject } from "@nestjs/common";
import { Logger } from "winston";

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

  // 中间件必要实现方法
  use(req: Request, res: Response, next: NextFunction) {
    // 生成唯一请求ID
    req.reqId = randomUUID().slice(0, 16);
    // 挂载日志自定义字段
    this.logger.defaultMeta = { reqId: req.reqId };
    next();
  }
}

/**
 * this.logger.defaultMeta = { reqId: req.reqId };
这行直接修改共享 winston 实例的 defaultMeta，在高并发下会"串号"：

logger 是通过 WINSTON_MODULE_PROVIDER 注入的单例，整个应用只有一个实例
Node 是单线程但请求是异步交错执行的。请求 A 在中间件里设置了 defaultMeta = { reqId: "A" }，还没走到 controller 打日志
，请求 B 又进来了，把 defaultMeta 覆盖成 { reqId: "B" }
此时请求 A 打出的日志，reqId 会是 B 的——链路追踪失效
这是生产环境非常典型的"日志串号"问题，单发测试时看不出，压测才会暴露。

以上是nodejs在多并发请求下的常见问题 

正确做法（三选一）
方案 A：child() 创建请求级 logger（最简单）


use(req, res, next) {
  req.reqId = randomUUID().slice(0, 16);
  // 不污染共享实例，每个请求一个独立的 child logger
  req.logger = this.logger.child({ reqId: req.reqId });
  next();
}
但这需要业务代码拿到 req.logger 再调用，改动面较大。

方案 B：AsyncLocalStorage（NestJS 官方推荐，推荐用现成的 nestjs-cls）
用 CLS 存储请求上下文，日志格式化时从 CLS 读 reqId，彻底避免污染共享状态，业务代码无需手动传 ID。

方案 C：手动传参
不用 defaultMeta，每次打日志时显式传 { reqId }——但违背了"自动绑定"的初衷。
 */
