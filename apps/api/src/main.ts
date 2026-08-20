import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt.auth.guard";
import { AllExceptionFilter } from "./common/filter/http-exception.filter";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { TransformInterceptor } from "./common/interceptor/transform.interceptor";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //全局注册后置拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  /**
   *  new ——使得对象在容器外被创建，构造器注入被跳过。
   *  改用 APP_* provider 注册，或至少用 app.get(Class) 拿容器实例
   */

  // 全局过滤器：
  // 全局注册异常过滤器
  app.useGlobalFilters(new AllExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)));

  app.setGlobalPrefix("api");
  // 注册全局守卫
  app.useGlobalGuards(app.get(JwtAuthGuard));

  /**
   * 全局管道另一种注册方式：
   * 
    app.useGlobalPipes(new ZodValidationPipe());
    缺陷： 非注入依赖
    new ZodValidationPipe() 手动 new，脱离 Nest DI 容器。
    管道类内部如果需要注入服务（比如 ConfigService），无法拿到依赖，直接报错。 
  */

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  //（这个 WinstonLogger 适配器内部就是包了一层原生 winston Logger，把 Nest 的 LoggerService 调用转发给 winston。）
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`PolisBlog API 已启动: http://localhost:${port}/api`);
}

void bootstrap();

/**
 *
  // 替换Nest原生日志为Winston日志
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger(logger);

 */
