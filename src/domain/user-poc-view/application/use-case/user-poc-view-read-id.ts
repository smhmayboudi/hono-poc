import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCViewReadID } from "../port/driven/user-poc-view-read-id.ts";
import type {
  PortDrivingUserPOCViewReadID,
  PortDrivingUserPOCViewReadIDRequest,
  PortDrivingUserPOCViewReadIDResponse,
} from "../port/driving/user-poc-view-read-id.ts";

export class UseCaseUserPOCViewReadID implements PortDrivingUserPOCViewReadID {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCViewReadID: PortDrivenUserPOCViewReadID,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCViewReadIDRequest,
  ): Promise<PortDrivingUserPOCViewReadIDResponse> {
    return tracer.startActiveSpan(
      "user-poc-view-read-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-read-id.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        const list = await this.drivenUserPOCViewReadID.read(data);
        this.logger.debug({ list });
        this.eventEmitter.emit("UserPOCViewUseCaseReadID", {
          request: data,
          response: list,
        });

        return list;
      },
    );
  }
}
