import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCCreate } from "../port/driven/user-poc-create.ts";
import type {
  PortDrivingUserPOCCreate,
  PortDrivingUserPOCCreateRequest,
  PortDrivingUserPOCCreateResponse,
} from "../port/driving/user-poc-create.ts";

export class UseCaseUserPOCCreate implements PortDrivingUserPOCCreate {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCCreate: PortDrivenUserPOCCreate,
    private readonly eventEmitter: PortEventEmitter,
    private readonly generate: PortGenerate,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCCreateRequest,
  ): Promise<PortDrivingUserPOCCreateResponse> {
    return tracer.startActiveSpan("user-poc-create.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-create.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      const id = this.generate.id();
      this.logger.debug({ id });
      await this.drivenUserPOCCreate.create({ ...data, id });
      this.eventEmitter.emit("UserPOCUseCaseCreate", {
        request: data,
        response: { id },
      });

      return { id };
    });
  }
}
