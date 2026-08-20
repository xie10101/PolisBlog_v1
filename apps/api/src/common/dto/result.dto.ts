import { HttpStatus } from "@nestjs/common";

/**
 * 统一响应体：code 对齐 HTTP 状态码，message 业务消息，data 业务数据。
 * 成功由拦截器调用 Result.success 包裹，失败由全局过滤器调用 Result.fail 渲染。
 */
export class Result<T = null> {
  code: number = HttpStatus.OK;
  message: string = "";
  data: T | null = null;

  static success<T>(data: T, message = "成功"): Result<T> {
    return { code: HttpStatus.OK, message, data };
  }

  static fail(code: number, message: string): Result<null> {
    return { code, message, data: null };
  }
}

/**
 * 成功响应体：{ code: 200, message: "成功", data }
 * 失败响应体：{ code: <HTTP状态码>, message: <业务消息>, data: null }
 * （错误响应由全局过滤器额外补充 reqId / timestamp）
 */

/**
 * 落地结果
新建 2 个文件：

business-code.ts — BizCode 码表，code 复用 HttpStatus 枚举（对齐 HTTP 状态码），message 承载业务文案，导出 BizCodeValue 类型。
business.exception.ts — BusinessException，继承 HttpException，构造时传入 BizCode 表项（可 overrideMessage 覆盖）。
改造 2 个文件：

result.dto.ts — 字段 msg → message，success 的 code 由 1 改为 HttpStatus.OK（200），fail(code, message) 返回 { code, message, data: null }。
http-exception.filter.ts — 增加 BusinessException 最高优先级分支，默认消息改用 BizCode.INTERNAL_ERROR.message，并给 HttpException 分支的 message 加了 ?? message 兜底。
重构 4 个文件（硬编码文案 → BusinessException(BizCode.KEY)）：

user.service.ts：用户名已存在 / 邮箱已被注册 / 用户不存在（×3）
auth.service.ts：refreshToken 无效 / token 失效
local.strategy.ts：用户名或密码错误
jwt.strategy.ts：用户不存在
同时移除了各文件不再使用的 ConflictException / NotFoundException / UnauthorizedException 导入。

一处与计划的偏差（跟随你的最新改动）
我注意到 main.ts 和过滤器你已经自己改过一部分（拦截器已注册、useLogger(WINSTON_MODULE_NEST_PROVIDER) 已加、过滤器已改为 Result.fail(status, message) 返回）。所以：

main.ts 无需我再动——拦截器、useLogger 都已就位。
错误响应体现在是 { code, message, data: null }（不再含 reqId/timestamp），reqId/timestamp 只保留在日志里。这与成功体 { code, message, data } 完全同构，我按你的最新方向保留了，没有回退成计划里「错误体多带 reqId/timestamp」的写法。
最终响应形状
成功：{ code: 200, message: "成功", data: <原始数据> }（拦截器自动包裹）
业务错误：{ code: 409, message: "用户名已存在", data: null } 等
认证错误：{ code: 401, message: "用户名或密码错误", data: null }
可按计划里的验证方式启动 pnpm dev 后实测 register / login / findOne 几个场景。需要我帮你跑起来验证一下接口返回吗？
 */
