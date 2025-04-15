import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCRead } from "../port/driven/user-poc-read.ts";
import type {
  PortDrivingUserPOCRead,
  PortDrivingUserPOCReadRequest,
  PortDrivingUserPOCReadResponse,
} from "../port/driving/user-poc-read.ts";

export class UseCaseUserPOCRead implements PortDrivingUserPOCRead {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCRead: PortDrivenUserPOCRead,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCReadRequest,
  ): Promise<PortDrivingUserPOCReadResponse> {
    return tracer.startActiveSpan("user-poc-read.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-read.use-case",
        config: this.config,
        data,
      });
      this.logger.info({});
      const list = await this.drivenUserPOCRead.read(data);
      this.logger.debug({ list });
      this.eventEmitter.emit("UserPOCUseCaseRead", {
        request: data,
        response: list,
      });

      return list;
    });
  }
}
