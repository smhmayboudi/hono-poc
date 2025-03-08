import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCInformationDelete } from "../port/driven/user-poc-information-delete.ts";
import type {
  PortDrivingUserPOCInformationDelete,
  PortDrivingUserPOCInformationDeleteRequest,
  PortDrivingUserPOCInformationDeleteResponse,
} from "../port/driving/user-poc-information-delete.ts";

export class UseCaseUserPOCInformationDelete
  implements PortDrivingUserPOCInformationDelete
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationDelete: PortDrivenUserPOCInformationDelete,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationDeleteRequest,
  ): Promise<PortDrivingUserPOCInformationDeleteResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-delete.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-delete.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        await this.drivenUserPOCInformationDelete.delete(data);

        return { id: data.id };
      },
    );
  }
}
