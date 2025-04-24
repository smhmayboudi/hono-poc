import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCReadID } from "../port/driven/user-poc-read-id.ts";
import type {
  PortDrivingUserPOCReadID,
  PortDrivingUserPOCReadIDRequest,
  PortDrivingUserPOCReadIDResponse,
} from "../port/driving/user-poc-read-id.ts";

export class UseCaseUserPOCReadID implements PortDrivingUserPOCReadID {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCReadID: PortDrivenUserPOCReadID,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCReadIDRequest,
  ): Promise<PortDrivingUserPOCReadIDResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-read-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-read-id.use-case",
          config: this.config,
          data,
        });
        this.logger.info({});
        const list = await this.drivenUserPOCReadID.readID(data);
        this.logger.debug({ list });
        this.eventEmitter.emit("UserPOCUseCaseReadID", {
          request: data,
          response: list,
        });

        return list;
      },
    );
  }
}
