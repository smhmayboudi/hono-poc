import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { eq } from "drizzle-orm";

import type { PortCacher } from "../../../../infrastructure/application/port/cacher/cacher.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCView } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import { ErrorNoRowFound } from "../../../../shared/application/error/no-row-found.ts";
import type {
  PortDrivenUserPOCViewReadID,
  PortDrivenUserPOCViewReadIDRequest,
  PortDrivenUserPOCViewReadIDResponse,
} from "../../application/port/driven/user-poc-view-read-id.ts";

export class AdapterDrivenUserPOCViewReadID
  implements PortDrivenUserPOCViewReadID
{
  constructor(
    private readonly cacher: PortCacher,
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  readID(
    data: PortDrivenUserPOCViewReadIDRequest,
  ): Promise<PortDrivenUserPOCViewReadIDResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-view-read-id.driven",
      async () => {
        return this.cacher.wrap(
          this.cacher.key<"DrivenUserPOCViewReadID">(data)
            .DrivenUserPOCViewReadID,
          async () => {
            this.logger.assign({
              [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-read-id.driven",
              config: this.config,
              data,
            });
            this.logger.info({});
            const result = (
              await this.database
                .db()
                .select()
                .from(userPOCView)
                .where(eq(userPOCView.user_poc_id, data.id))
                .execute()
            ).map((value) => ({
              address: String(value.user_poc_information_address),
              age: Number(value.user_poc_information_age),
              fullname: String(value.user_poc_fullname),
              id: String(value.user_poc_id),
            }));
            this.logger.debug({ result });
            const firstResult = result[0];
            if (!firstResult) {
              this.logger.debug("!firstResult");
              throw new ErrorNoRowFound();
            }

            return firstResult;
          },
        );
      },
    );
  }
}
