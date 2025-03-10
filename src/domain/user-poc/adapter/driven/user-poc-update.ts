import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { eq } from "drizzle-orm";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortCacher } from "../../../../infrastructure/application/port/cacher/cacher.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOC } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { ErrorNoRowsAffected } from "../../../../shared/application/error/no-rows-affected.ts";
import type {
  PortDrivenUserPOCUpdate,
  PortDrivenUserPOCUpdateRequest,
  PortDrivenUserPOCUpdateResponse,
} from "../../application/port/driven/user-poc-update.ts";

export class AdapterDrivenUserPOCUpdate implements PortDrivenUserPOCUpdate {
  constructor(
    private readonly cacher: PortCacher,
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {}

  update(
    data: PortDrivenUserPOCUpdateRequest,
  ): Promise<PortDrivenUserPOCUpdateResponse> {
    return tracer.startActiveSpan("user-poc-update.driven", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-update.driven",
        config: this.config,
        data,
      });
      this.logger.info({});
      const result = await this.database
        .db()
        .update(userPOC)
        .set(data)
        .where(eq(userPOC.id, data.id))
        .execute();
      this.logger.debug({ result });
      if (result[0].affectedRows === 0) {
        this.logger.debug("result[0].affectedRows === 0");
        throw new ErrorNoRowsAffected();
      }
      this.cacher.del(this.cacher.key({ id: data.id }).userPOCViewReadIdDriven);
    });
  }
}
