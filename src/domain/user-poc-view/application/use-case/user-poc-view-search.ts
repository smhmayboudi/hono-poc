import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
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
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCViewSearchRequest,
  ): Promise<PortDrivingUserPOCViewSearchResponse> {
    return tracer.startActiveSpan("user-poc-view-search.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-search.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      const list = await this.drivenUserPOCViewSearch.search(data);
      this.logger.debug({ list });

      return list;
    });
  }
}
