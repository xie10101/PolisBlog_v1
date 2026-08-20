import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";
import { ZodValidationPipe } from "nestjs-zod";
import { APP_PIPE } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt.auth.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { LoggerModule } from "./common/logger/logger.module";
import { PostModule } from "./modules/post/post.module";
import { CategoryModule } from "./modules/category/category.module";
import { NestModule } from "@nestjs/common";
import { MiddlewareConsumer } from "@nestjs/common";
import { ReqIdMiddleware } from "./common/middleware/reqid.middleware";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注册，其他模块无需再导入 ConfigModule
      envFilePath: [".env", ".env.local"], // 默认，可指定多文件 ['.env', '.env.local']
      ignoreEnvFile: false, // true 则不读取 .env，只读取系统环境变量
      ignoreEnvVars: false, // true 忽略系统环境变量，只读取文件
    }),
    DbModule,
    AuthModule,
    UserModule,
    PostModule,
    CategoryModule,
    LoggerModule,
  ],
  providers: [
    JwtAuthGuard,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe, // 全局开启zod校验管道
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqIdMiddleware).forRoutes("*");
  }
}
/**
 * AppModule 通过实现 NestModule 接口
 * 来注册全局中间件，目的是给每个 HTTP 请求绑定一个 reqId（链路追踪 ID）
 * 
 * 这让 Nest 知道"这个模块要配置中间件"，从而在应用启动阶段回调 configure() 方法。

② configure(consumer)：这是 NestModule 接口要求实现的唯一方法。consumer 是 Nest 注入的 MiddlewareConsumer，提供链式 API 来声明中间件的挂载范围。

③ apply().forRoutes("*")：

apply(...) —— 声明要挂载的中间件（可传多个，如 apply(A, B)）

forRoutes("*") —— 通配符，表示应用到所有路由（等价于 forRoutes({ path: "*", method: RequestMethod.ALL })）
 */


