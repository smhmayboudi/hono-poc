import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortEventEmitter } from "../../../../infrastructure/application/port/event-emitter/event-emitter.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivingUserPOCUpdate } from "../../../user-poc/application/port/driving/user-poc-update.ts";
import type { PortDrivingUserPOCInformationUpdateUserID } from "../../../user-poc-information/application/port/driving/user-poc-information-update-user-id.ts";
import type {
  PortDrivingUserPOCViewUpdate,
  PortDrivingUserPOCViewUpdateRequest,
  PortDrivingUserPOCViewUpdateResponse,
} from "../port/driving/user-poc-view-update.ts";

export class UseCaseUserPOCViewUpdate implements PortDrivingUserPOCViewUpdate {
  constructor(
    private readonly config: PortConfig,
    private readonly drivingUserPOCUpdate: PortDrivingUserPOCUpdate,
    private readonly drivingUserPOCInformationUpdateUserID: PortDrivingUserPOCInformationUpdateUserID,
    private readonly eventEmitter: PortEventEmitter,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCViewUpdateRequest,
  ): Promise<PortDrivingUserPOCViewUpdateResponse> {
    return tracer.startActiveSpan("user-poc-view-update.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-update.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      const { userId: userPOCInformationUserId } =
        await this.drivingUserPOCInformationUpdateUserID.execute({
          address: data.address,
          age: data.age,
          userId: data.id,
        });
      this.logger.debug({ userPOCInformationUserId });
      const { id: userPOCId } = await this.drivingUserPOCUpdate.execute({
        fullname: data.fullname,
        id: data.id,
      });
      this.logger.debug({ userPOCId });
      this.eventEmitter.emit("UserPOCViewUseCaseUpdate", {
        request: data,
        response: { id: userPOCId },
      });

      return { id: userPOCId };
    });
  }
}
