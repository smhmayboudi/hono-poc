import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { eq } from "drizzle-orm";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCInformation } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import { ErrorNoRowsAffected } from "../../../../shared/application/error/no-rows-affected.ts";
import type {
  PortDrivenUserPOCInformationUpdateUserId,
  PortDrivenUserPOCInformationUpdateUserIdRequest,
  PortDrivenUserPOCInformationUpdateUserIdResponse,
} from "../../application/port/driven/user-poc-information-update-user-id.ts";

export class AdapterDrivenUserPOCInformationUpdateUserId
  implements PortDrivenUserPOCInformationUpdateUserId
{
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {}

  update(
    data: PortDrivenUserPOCInformationUpdateUserIdRequest,
  ): Promise<PortDrivenUserPOCInformationUpdateUserIdResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-update-user-id.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]:
            "user-poc-information-update-user-id.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = await this.database
          .db()
          .update(userPOCInformation)
          .set(data)
          .where(eq(userPOCInformation.userId, data.userId))
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
