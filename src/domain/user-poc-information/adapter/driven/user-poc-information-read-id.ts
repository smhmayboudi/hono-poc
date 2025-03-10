import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { eq } from "drizzle-orm";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCInformation } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { ErrorNoRowFound } from "../../../../shared/application/error/no-row-found.ts";
import type {
  PortDrivenUserPOCInformationReadID,
  PortDrivenUserPOCInformationReadIDRequest,
  PortDrivenUserPOCInformationReadIDResponse,
} from "../../application/port/driven/user-poc-information-read-id.ts";

export class AdapterDrivenUserPOCInformationReadID
  implements PortDrivenUserPOCInformationReadID
{
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {}

  read(
    data: PortDrivenUserPOCInformationReadIDRequest,
  ): Promise<PortDrivenUserPOCInformationReadIDResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-read-id.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-read-id.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = await this.database
          .db()
          .select()
          .from(userPOCInformation)
          .where(eq(userPOCInformation.id, data.id))
          .execute();
        this.logger.debug({ result });
        const firstResult = result[0];
        if (!firstResult) {
          throw new ErrorNoRowFound();
        }

        return firstResult;
      },
    );
  }
}
