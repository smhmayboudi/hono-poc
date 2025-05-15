import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCInformationReadID } from "../port/driven/user-poc-information-read-id.ts";
import type {
  PortDrivingUserPOCInformationReadID,
  PortDrivingUserPOCInformationReadIDRequest,
  PortDrivingUserPOCInformationReadIDResponse,
} from "../port/driving/user-poc-information-read-id.ts";

export class UseCaseUserPOCInformationReadID
  implements PortDrivingUserPOCInformationReadID
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationReadID: PortDrivenUserPOCInformationReadID,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationReadIDRequest,
  ): Promise<PortDrivingUserPOCInformationReadIDResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-information-read-id.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-read-id.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        const list = await this.drivenUserPOCInformationReadID.readID(data);
        this.logger.debug({ list });
        this.eventEmitter.emit("UserPOCInformationUseCaseReadID", {
          request: data,
          response: list,
        });

        return list;
      },
    );
  }
}
