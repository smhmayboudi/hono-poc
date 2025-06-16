import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenCSPRead } from "../port/driven/csp-read.ts";
import type {
  PortDrivingCSPRead,
  PortDrivingCSPReadRequest,
  PortDrivingCSPReadResponse,
} from "../port/driving/csp-read.ts";

export class UseCaseCSPRead implements PortDrivingCSPRead {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenCSPRead: PortDrivenCSPRead,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingCSPReadRequest,
  ): Promise<PortDrivingCSPReadResponse> {
    return this.tracer.startActiveSpan("csp-read.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "csp-read.use-case",
        config: this.config,
        data,
      });
      this.logger.info({});
      const list = await this.drivenCSPRead.read(data);
      this.logger.debug({ list });
      this.eventEmitter.emit("CSPUseCaseRead", {
        request: data,
        response: list,
      });

      return list;
    });
  }
}
