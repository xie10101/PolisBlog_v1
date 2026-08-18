import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/is‑public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super(); // super('jwt') 绑定策略名字，会去找你的 JwtStrategy
  }

  canActivate(context: ExecutionContext) {
    // 读取 @IsPublic() 装饰器元数据做白名单
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // 白名单接口，直接放行，不触发JwtStrategy
    }

    // 不在白名单：执行父类AuthGuard('jwt')逻辑，自动调用你的 JwtStrategy
    return super.canActivate(context);
  }
}
