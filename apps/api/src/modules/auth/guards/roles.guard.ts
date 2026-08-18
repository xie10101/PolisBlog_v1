import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 读取元数据 -role 
    const requireRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireRoles) return true;

    // 当前请求的身份角色
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return requireRoles.includes(user.role); 
    // 布尔返回用于判断
  }
}
