import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
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
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCReadIDRequest,
  ): Promise<PortDrivingUserPOCReadIDResponse> {
    return tracer.startActiveSpan("user-poc-read-id.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-read-id.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      const list = await this.drivenUserPOCReadID.readID(data);
      this.logger.debug({ list });

      return list;
    });
  }
}
