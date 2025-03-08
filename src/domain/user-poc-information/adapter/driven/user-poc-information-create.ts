import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { userPOCInformation } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type {
  PortDrivenUserPOCInformationCreate,
  PortDrivenUserPOCInformationCreateRequest,
  PortDrivenUserPOCInformationCreateResponse,
} from "../../application/port/driven/user-poc-information-create.ts";

export class AdapterDrivenUserPOCInformationCreate
  implements PortDrivenUserPOCInformationCreate
{
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
  ) {}

  create(
    data: PortDrivenUserPOCInformationCreateRequest,
  ): Promise<PortDrivenUserPOCInformationCreateResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-create.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-create.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = await this.database
          .db()
          .insert(userPOCInformation)
          .values(data)
          .execute();
        this.logger.debug({ result });
      },
    );
  }
}
