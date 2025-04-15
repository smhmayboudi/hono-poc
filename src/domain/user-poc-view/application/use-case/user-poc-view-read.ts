import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCViewRead } from "../port/driven/user-poc-view-read.ts";
import type {
  PortDrivingUserPOCViewRead,
  PortDrivingUserPOCViewReadRequest,
  PortDrivingUserPOCViewReadResponse,
} from "../port/driving/user-poc-view-read.ts";

export class UseCaseUserPOCViewRead implements PortDrivingUserPOCViewRead {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCViewRead: PortDrivenUserPOCViewRead,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCViewReadRequest,
  ): Promise<PortDrivingUserPOCViewReadResponse> {
    return tracer.startActiveSpan("user-poc-view-read.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-read.use-case",
        config: this.config,
        data,
      });
      this.logger.info({});
      const list = await this.drivenUserPOCViewRead.read(data);
      this.logger.debug({ list });
      this.eventEmitter.emit("UserPOCViewUseCaseRead", {
        request: data,
        response: list,
      });

      return list;
    });
  }
}
