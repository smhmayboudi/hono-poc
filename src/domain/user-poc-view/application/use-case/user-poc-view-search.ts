import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCViewSearch } from "../port/driven/user-poc-view-search.ts";
import type {
  PortDrivingUserPOCViewSearch,
  PortDrivingUserPOCViewSearchRequest,
  PortDrivingUserPOCViewSearchResponse,
} from "../port/driving/user-poc-view-search.ts";

export class UseCaseUserPOCViewSearch implements PortDrivingUserPOCViewSearch {
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCViewSearch: PortDrivenUserPOCViewSearch,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCViewSearchRequest,
  ): Promise<PortDrivingUserPOCViewSearchResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-view-search.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-search.use-case",
          config: this.config,
          data,
        });
        this.logger.info({});
        const list = await this.drivenUserPOCViewSearch.search(data);
        this.logger.debug({ list });
        this.eventEmitter.emit("UserPOCViewUseCaseSearch", {
          request: data,
          response: list,
        });

        return list;
      },
    );
  }
}
