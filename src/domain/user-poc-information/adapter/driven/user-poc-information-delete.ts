import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { eq } from "drizzle-orm";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCInformation } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { ErrorNoRowsAffected } from "../../../../shared/application/error/no-rows-affected.ts";
import type {
  PortDrivenUserPOCInformationDelete,
  PortDrivenUserPOCInformationDeleteRequest,
  PortDrivenUserPOCInformationDeleteResponse,
} from "../../application/port/driven/user-poc-information-delete.ts";

export class AdapterDrivenUserPOCInformationDelete
  implements PortDrivenUserPOCInformationDelete
{
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {}

  delete(
    data: PortDrivenUserPOCInformationDeleteRequest,
  ): Promise<PortDrivenUserPOCInformationDeleteResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-delete.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-delete.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = await this.database
          .db()
          .delete(userPOCInformation)
          .where(eq(userPOCInformation.id, data.id))
          .execute();
        this.logger.debug({ result });
        if (result[0].affectedRows === 0) {
          this.logger.debug("result[0].affectedRows === 0");
          throw new ErrorNoRowsAffected();
        }
      },
    );
  }
}
