import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCInformationDeleteUserId } from "../port/driven/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCInformationDeleteUserId,
  PortDrivingUserPOCInformationDeleteUserIdRequest,
  PortDrivingUserPOCInformationDeleteUserIdResponse,
} from "../port/driving/user-poc-information-delete-user-id.ts";

export class UseCaseUserPOCInformationDeleteUserId
  implements PortDrivingUserPOCInformationDeleteUserId
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationDeleteUserId: PortDrivenUserPOCInformationDeleteUserId,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationDeleteUserIdRequest,
  ): Promise<PortDrivingUserPOCInformationDeleteUserIdResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-delete-user-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]:
            "user-poc-information-delete-user-id.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        await this.drivenUserPOCInformationDeleteUserId.deleteUserId(data);
        this.eventEmitter.emit("UserPOCInformationUseCaseDeleteUserId", {
          request: data,
          response: { userId: data.userId },
        });

        return { userId: data.userId };
      },
    );
  }
}
