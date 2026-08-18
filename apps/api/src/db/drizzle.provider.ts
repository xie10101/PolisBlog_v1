import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const DRIZZLE_DB = "DRIZZLE_DB";

export const drizzleProvider: Provider = {
  provide: DRIZZLE_DB,
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>("DATABASE_URL");
    const pool = new Pool({ connectionString });
    return drizzle(pool);
  },
  inject: [ConfigService],
};

/**
 * 依赖注入提供工厂函数
 */