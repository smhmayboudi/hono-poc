import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type { PortDrivingUserPOCCreate } from "../../../user-poc/application/port/driving/user-poc-create.ts";
import type { PortDrivingUserPOCInformationCreate } from "../../../user-poc-information/application/port/driving/user-poc-information-create.ts";
import type {
  PortDrivingUserPOCViewCreate,
  PortDrivingUserPOCViewCreateRequest,
  PortDrivingUserPOCViewCreateResponse,
} from "../port/driving/user-poc-view-create.ts";

export class UseCaseUserPOCViewCreate implements PortDrivingUserPOCViewCreate {
  constructor(
    private readonly config: PortConfig,
    private readonly drivingUserPOCCreate: PortDrivingUserPOCCreate,
    private readonly drivingUserPOCInformationCreate: PortDrivingUserPOCInformationCreate,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  execute(
    data: PortDrivingUserPOCViewCreateRequest,
  ): Promise<PortDrivingUserPOCViewCreateResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-view-create.use-case",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-create.use-case",
          config: this.config,
          data,
        });
        this.logger.info({});
        const { id: userPOCId } = await this.drivingUserPOCCreate.execute({
          fullname: data.fullname,
        });
        this.logger.debug({ userPOCId });
        const { id: userPOCInformationId } =
          await this.drivingUserPOCInformationCreate.execute({
            address: data.address,
            age: data.age,
            userId: userPOCId,
          });
        this.logger.debug({ userPOCInformationId });
        this.eventEmitter.emit("UserPOCViewUseCaseCreate", {
          request: data,
          response: { id: userPOCId },
        });

        return { id: userPOCId };
      },
    );
  }
}
