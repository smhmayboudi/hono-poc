import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
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
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCDeleteRequest,
  ): Promise<PortDrivingUserPOCDeleteResponse> {
    return tracer.startActiveSpan("user-poc-delete.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-delete.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      await this.drivenUserPOCDelete.delete(data);

      return { id: data.id };
    });
  }
}
