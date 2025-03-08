import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
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
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCUpdateRequest,
  ): Promise<PortDrivingUserPOCUpdateResponse> {
    return tracer.startActiveSpan("user-poc-update.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-update.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      await this.drivenUserPOCUpdate.update(data);

      return { id: data.id };
    });
  }
}
