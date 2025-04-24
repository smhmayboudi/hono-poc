import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCInformationDeleteUserID } from "../port/driven/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserID,
  PortDrivingUserPOCInformationDeleteUserIDRequest,
  PortDrivingUserPOCInformationDeleteUserIDResponse,
} from "../port/driving/user-poc-information-delete-user-id.ts";

export class UseCaseUserPOCInformationDeleteUserID
  implements PortDrivingUserPOCInformationDeleteUserID
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationDeleteUserID: PortDrivenUserPOCInformationDeleteUserID,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationDeleteUserIDRequest,
  ): Promise<PortDrivingUserPOCInformationDeleteUserIDResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-information-delete-user-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]:
            "user-poc-information-delete-user-id.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        await this.drivenUserPOCInformationDeleteUserID.deleteUserId(data);
        this.eventEmitter.emit("UserPOCInformationUseCaseDeleteUserID", {
          request: data,
          response: { userId: data.userId },
        });

        return { userId: data.userId };
      },
    );
  }
}
