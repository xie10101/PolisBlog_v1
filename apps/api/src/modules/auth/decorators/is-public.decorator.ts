import { SetMetadata } from "@nestjs/common";
export const IS_PUBLIC_KEY = "isPublic";
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

// 自定义装饰器 - isPublic