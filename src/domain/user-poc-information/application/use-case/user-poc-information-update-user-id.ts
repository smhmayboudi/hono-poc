import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCInformationUpdateUserId } from "../port/driven/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserId,
  PortDrivingUserPOCInformationUpdateUserIdRequest,
  PortDrivingUserPOCInformationUpdateUserIdResponse,
} from "../port/driving/user-poc-information-update-user-id.ts";

export class UseCaseUserPOCInformationUpdateUserId
  implements PortDrivingUserPOCInformationUpdateUserId
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationUpdateUserId: PortDrivenUserPOCInformationUpdateUserId,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationUpdateUserIdRequest,
  ): Promise<PortDrivingUserPOCInformationUpdateUserIdResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-update-user-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]:
            "user-poc-information-update-user-id.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        await this.drivenUserPOCInformationUpdateUserId.updateUserId(data);

        return { userId: data.userId };
      },
    );
  }
}
