import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortTime } from "../../../../infrastructure/application/port/time/time.ts";
import type { PortDrivenCSPCreate } from "../port/driven/csp-create.ts";
import type {
  PortDrivingCSPCreate,
  PortDrivingCSPCreateRequest,
  PortDrivingCSPCreateResponse,
} from "../port/driving/csp-create.ts";

export class UseCaseCSPCreate implements PortDrivingCSPCreate {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenCSPCreate: PortDrivenCSPCreate,
    private readonly eventEmitter: PortEventEmitter,
    private readonly generate: PortGenerate,
    private readonly logger: PortLogger,
    private readonly time: PortTime,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingCSPCreateRequest,
  ): Promise<PortDrivingCSPCreateResponse> {
    return this.tracer.startActiveSpan("csp-create.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "csp-create.use-case",
        config: this.config,
        data,
      });
      this.logger.info({});
      const id = this.generate.id();
      this.logger.debug({ id });
      const timestamp = this.time.now();
      this.logger.debug({ timestamp });
      await this.drivenCSPCreate.create({ ...data, id, timestamp });
      this.eventEmitter.emit("CSPUseCaseCreate", {
        request: data,
        response: { id, timestamp },
      });

      return { id, timestamp };
    });
  }
}
