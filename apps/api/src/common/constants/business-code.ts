import { HttpStatus } from "@nestjs/common";

/**
 * 业务响应码表：code 对齐 HTTP 状态码，message 承载业务细节。
 * 键名（如 USERNAME_EXISTS）是业务语义，供 service 抛异常 / 统一返回时引用。
 */
export const BizCode = {
  SUCCESS: { code: HttpStatus.OK, message: "成功" }, // 200

  // 通用
  BAD_REQUEST: { code: HttpStatus.BAD_REQUEST, message: "请求参数错误" }, // 400
  UNAUTHORIZED: { code: HttpStatus.UNAUTHORIZED, message: "未登录或凭证无效" }, // 401
  FORBIDDEN: { code: HttpStatus.FORBIDDEN, message: "无权限访问" }, // 403
  NOT_FOUND: { code: HttpStatus.NOT_FOUND, message: "资源不存在" }, // 404
  CONFLICT: { code: HttpStatus.CONFLICT, message: "资源冲突" }, // 409
  INTERNAL_ERROR: { code: HttpStatus.INTERNAL_SERVER_ERROR, message: "服务器内部错误" }, // 500

  // 用户模块
  USERNAME_EXISTS: { code: HttpStatus.CONFLICT, message: "用户名已存在" },
  EMAIL_EXISTS: { code: HttpStatus.CONFLICT, message: "邮箱已被注册" },
  USER_NOT_FOUND: { code: HttpStatus.NOT_FOUND, message: "用户不存在" },

  // 认证模块
  INVALID_CREDENTIALS: { code: HttpStatus.UNAUTHORIZED, message: "用户名或密码错误" },
  TOKEN_INVALID: { code: HttpStatus.UNAUTHORIZED, message: "refreshToken 无效或已过期" },
  TOKEN_REVOKED: { code: HttpStatus.UNAUTHORIZED, message: "token 已失效，请重新登录" },

  // 文章模块
  POST_NOT_FOUND: { code: HttpStatus.NOT_FOUND, message: "文章不存在" },
  POST_SLUG_EXISTS: { code: HttpStatus.CONFLICT, message: "文章 slug 已存在" },
  POST_ALREADY_DELETED: { code: HttpStatus.BAD_REQUEST, message: "文章已在回收站中" },
  POST_NOT_DELETED: { code: HttpStatus.BAD_REQUEST, message: "文章不在回收站中" },

  // 分类模块
  CATEGORY_NOT_FOUND: { code: HttpStatus.NOT_FOUND, message: "分类不存在" },
  CATEGORY_NAME_EXISTS: { code: HttpStatus.CONFLICT, message: "分类名称已存在" },
  CATEGORY_SLUG_EXISTS: { code: HttpStatus.CONFLICT, message: "分类 slug 已存在" },
  CATEGORY_ALREADY_DELETED: { code: HttpStatus.BAD_REQUEST, message: "分类已删除" },
} as const;

export type BizCodeValue = (typeof BizCode)[keyof typeof BizCode];
