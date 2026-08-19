import { Controller, Get } from "@nestjs/common";
// import { APP_NAME, type ApiResponse } from "@polisblog/shared";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): ApiResponse<string> {
  //   return this.appService.getHello();
  // }

  // @Get("health")
  // health(): ApiResponse<{ status: string; app: string }> {
  //   return {
  //     code: 0,
  //     message: "ok",
  //     data: { status: "up", app: APP_NAME },
  //   };
  // }
}
