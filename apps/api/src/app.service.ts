import { Injectable } from "@nestjs/common";
import { APP_NAME, type ApiResponse } from "@polisblog/shared";

@Injectable()
export class AppService {
  getHello(): ApiResponse<string> {
    return {
      code: 0,
      message: "ok",
      data: `Hello from ${APP_NAME} API`,
    };
  }
}
