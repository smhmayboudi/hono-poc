import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOC } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCCreate,
  PortDrivenUserPOCCreateRequest,
  PortDrivenUserPOCCreateResponse,
} from "../../application/port/driven/user-poc-create.ts";

export class AdapterDrivenUserPOCCreate implements PortDrivenUserPOCCreate {
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  create(
    data: PortDrivenUserPOCCreateRequest,
  ): Promise<PortDrivenUserPOCCreateResponse> {
    return this.tracer.startActiveSpan("user-poc-create.driven", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-create.driven",
        config: this.config,
        data,
      });
      this.logger.info({});
      const result = await this.database
        .db()
        .insert(userPOC)
        .values(data)
        .execute();
      this.logger.debug({ result });
    });
  }
}
