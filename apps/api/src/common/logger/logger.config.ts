import { format, transports, LoggerOptions } from "winston";
import type { transport } from "winston";
import "winston-daily-rotate-file";

// 日志存储根目录  -- 项目运行的根目录
const LOG_DIR = process.cwd() + "/logs";
// 日志输出格式：时间 + 级别 + 请求ID + 日志内容
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }), // 捕获错误堆栈信息
  format.printf((info) => {
    return `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.reqId || ""}: ${info.message} ${info.stack || ""}`;
  }),
);

// 开发环境控制台彩色输出
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf((info) => {
    return `[${info.timestamp}] [${info.level}] ${info.reqId || ""}: ${info.message} ${info.stack || ""}`;
  }),
);

/*
// 日志传输通道（输出目的地）集合：按天切割的文件传输器
// 显式标注为 transport（TransportStream 基类）(property)
// 单独创建避免undefined 导致识别保存 - winston.LoggerOptions.transports?: transport | transport[] | undefined，
// 导致 push 控制台传输器时报"类型不匹配"。
*/
const appTransports: transport[] = [
  // 1. 普通日志文件：按天切割，存储info及以下级别日志
  new transports.DailyRotateFile({
    filename: `${LOG_DIR}/info/%DATE%.log`,
    // 文件名中 %DATE% 占位符被替换成的时间格式
    datePattern: "YYYY-MM-DD",
    level: "info",
    maxSize: "20m", // 单文件最大20MB
    maxFiles: "14d", // 保留14天日志
    zippedArchive: true, // 过期日志压缩归档
  }),
  // 2. 错误日志文件：单独存储error级别日志
  new transports.DailyRotateFile({
    filename: `${LOG_DIR}/error/%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxSize: "20m",
    maxFiles: "30d", // 错误日志保留30天
    zippedArchive: true,
  }),
];

// 开发环境追加控制台输出 - 仅在开发环境设置控制台日志输出
if (process.env.NODE_ENV !== "production") {
  appTransports.push(
    new transports.Console({
      format: consoleFormat,
    }),
  );
}

// 通用日志传输配置
export const loggerConfig: LoggerOptions = {
  // 全局日志级别：开发环境debug，生产环境info
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  // 传输通道数组：日志最终写往的所有目的地
  transports: appTransports,
};
