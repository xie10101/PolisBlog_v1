import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt.auth.guard";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix("api");
  // 注册全局守卫
  app.useGlobalGuards(app.get(JwtAuthGuard));
  /**
 * 全局管道另一种注册方式：
 * 
 * // 注册全局管道，可以传多个实例
  app.useGlobalPipes(new ZodValidationPipe());
  缺陷： 非注入依赖
  new ZodValidationPipe() 手动 new，脱离 Nest DI 容器。
管道类内部如果需要注入服务（比如 ConfigService），无法拿到依赖，直接报错。 
 */

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`PolisBlog API 已启动: http://localhost:${port}/api`);
}

void bootstrap();
