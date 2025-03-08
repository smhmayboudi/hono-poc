import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivenUserPOCInformationRead } from "../port/driven/user-poc-information-read.ts";
import type {
  PortDrivingUserPOCInformationRead,
  PortDrivingUserPOCInformationReadRequest,
  PortDrivingUserPOCInformationReadResponse,
} from "../port/driving/user-poc-information-read.ts";

export class UseCaseUserPOCInformationRead
  implements PortDrivingUserPOCInformationRead
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationRead: PortDrivenUserPOCInformationRead,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationReadRequest,
  ): Promise<PortDrivingUserPOCInformationReadResponse> {
    return tracer.startActiveSpan(
      "user-poc-information-read.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-read.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        const list = await this.drivenUserPOCInformationRead.read(data);
        this.logger.debug({ list });

        return list;
      },
    );
  }
}
