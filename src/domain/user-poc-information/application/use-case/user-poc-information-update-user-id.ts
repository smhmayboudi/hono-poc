import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCInformationUpdateUserID } from "../port/driven/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCInformationUpdateUserID,
  PortDrivingUserPOCInformationUpdateUserIDRequest,
  PortDrivingUserPOCInformationUpdateUserIDResponse,
} from "../port/driving/user-poc-information-update-user-id.ts";

export class UseCaseUserPOCInformationUpdateUserID
  implements PortDrivingUserPOCInformationUpdateUserID
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationUpdateUserID: PortDrivenUserPOCInformationUpdateUserID,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationUpdateUserIDRequest,
  ): Promise<PortDrivingUserPOCInformationUpdateUserIDResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-information-update-user-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]:
            "user-poc-information-update-user-id.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        await this.drivenUserPOCInformationUpdateUserID.updateUserId(data);
        this.eventEmitter.emit("UserPOCInformationUseCaseUpdateUserID", {
          request: data,
          response: { userId: data.userId },
        });

        return { userId: data.userId };
      },
    );
  }
}
