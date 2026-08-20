import { HttpException } from "@nestjs/common";
import type { BizCodeValue } from "../constants/business-code";

/**
 * 业务异常：携带业务码（= HTTP 状态码）与业务消息，由全局过滤器统一渲染。
 */
export class BusinessException extends HttpException {
  readonly biz: BizCodeValue;

  constructor(biz: BizCodeValue, overrideMessage?: string) {
    super(overrideMessage ?? biz.message, biz.code);
    this.biz = biz;
  }
}
