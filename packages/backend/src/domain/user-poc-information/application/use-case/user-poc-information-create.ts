import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortGenerate } from "../../../../infrastructure/application/port/generate/generate.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivenUserPOCInformationCreate } from "../port/driven/user-poc-information-create.ts";
import type {
  PortDrivingUserPOCInformationCreate,
  PortDrivingUserPOCInformationCreateRequest,
  PortDrivingUserPOCInformationCreateResponse,
} from "../port/driving/user-poc-information-create.ts";

export class UseCaseUserPOCInformationCreate
  implements PortDrivingUserPOCInformationCreate
{
  constructor(
    private readonly config: PortConfig,
    private readonly drivenUserPOCInformationCreate: PortDrivenUserPOCInformationCreate,
    private readonly eventEmitter: PortEventEmitter,
    private readonly generate: PortGenerate,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCInformationCreateRequest,
  ): Promise<PortDrivingUserPOCInformationCreateResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-information-create.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-information-create.use-case",
          data,
          config: this.config,
        });
        this.logger.info({});
        const id = this.generate.id();
        this.logger.debug({ id });
        await this.drivenUserPOCInformationCreate.create({ ...data, id });
        this.eventEmitter.emit("UserPOCInformationUseCaseCreate", {
          request: data,
          response: { id },
        });

        return { id };
      },
    );
  }
}
