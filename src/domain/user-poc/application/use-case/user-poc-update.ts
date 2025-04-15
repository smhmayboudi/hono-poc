import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCUpdate } from "../port/driven/user-poc-update.ts";
import type {
  PortDrivingUserPOCUpdate,
  PortDrivingUserPOCUpdateRequest,
  PortDrivingUserPOCUpdateResponse,
} from "../port/driving/user-poc-update.ts";

export class UseCaseUserPOCUpdate implements PortDrivingUserPOCUpdate {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCUpdate: PortDrivenUserPOCUpdate,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCUpdateRequest,
  ): Promise<PortDrivingUserPOCUpdateResponse> {
    return tracer.startActiveSpan("user-poc-update.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-update.use-case",
        config: this.config,
        data,
      });
      this.logger.info({});
      await this.drivenUserPOCUpdate.update(data);
      this.eventEmitter.emit("UserPOCUseCaseUpdate", {
        request: data,
        response: { id: data.id },
      });

      return { id: data.id };
    });
  }
}
