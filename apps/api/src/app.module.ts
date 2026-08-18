import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";
import { ZodValidationPipe } from "nestjs-zod";
import { APP_PIPE } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注册，其他模块无需再导入 ConfigModule
      envFilePath: [".env", ".env.local"], // 默认，可指定多文件 ['.env', '.env.local']
      ignoreEnvFile: false, // true 则不读取 .env，只读取系统环境变量
      ignoreEnvVars: false, // true 忽略系统环境变量，只读取文件
    }),
    DbModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe, // 全局开启zod校验管道
    },
  ],
})
export class AppModule {}

/**
 * 根模块
 */