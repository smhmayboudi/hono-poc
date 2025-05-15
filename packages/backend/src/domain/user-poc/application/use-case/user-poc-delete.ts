import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCDelete } from "../port/driven/user-poc-delete.ts";
import type {
  PortDrivingUserPOCDelete,
  PortDrivingUserPOCDeleteRequest,
  PortDrivingUserPOCDeleteResponse,
} from "../port/driving/user-poc-delete.ts";

export class UseCaseUserPOCDelete implements PortDrivingUserPOCDelete {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCDelete: PortDrivenUserPOCDelete,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCDeleteRequest,
  ): Promise<PortDrivingUserPOCDeleteResponse> {
    return this.tracer.startActiveSpan("user-poc-delete.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-delete.use-case",
        config: this.config,
        data,
      });
      this.logger.info({});
      await this.drivenUserPOCDelete.delete(data);
      this.eventEmitter.emit("UserPOCUseCaseDelete", {
        request: data,
        response: { id: data.id },
      });

      return { id: data.id };
    });
  }
}
