import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCInformationUpdate } from "../port/driven/user-poc-information-update.ts";
import type {
  PortDrivingUserPOCInformationUpdate,
  PortDrivingUserPOCInformationUpdateRequest,
  PortDrivingUserPOCInformationUpdateResponse,
} from "../port/driving/user-poc-information-update.ts";

export class UseCaseUserPOCInformationUpdate
  implements PortDrivingUserPOCInformationUpdate
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationUpdate: PortDrivenUserPOCInformationUpdate,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationUpdateRequest,
  ): Promise<PortDrivingUserPOCInformationUpdateResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-information-update.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-update.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        await this.drivenUserPOCInformationUpdate.update(data);
        this.eventEmitter.emit("UserPOCInformationUseCaseUpdate", {
          request: data,
          response: { id: data.id },
        });

        return { id: data.id };
      },
    );
  }
}
