import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import { tracer } from "../../../../infrastructure/adapter/opentelemetry/opentelemetry.ts";
import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortDrivingUserPOCDelete } from "../../../user-poc/application/port/driving/user-poc-delete.ts";
import type { PortDrivingUserPOCInformationDeleteUserId } from "../../../user-poc-information/application/port/driving/user-poc-information-delete-user-id.ts";
import type {
  PortDrivingUserPOCViewDelete,
  PortDrivingUserPOCViewDeleteRequest,
  PortDrivingUserPOCViewDeleteResponse,
} from "../port/driving/user-poc-view-delete.ts";

export class UseCaseUserPOCViewDelete implements PortDrivingUserPOCViewDelete {
  constructor(
    private readonly config: PortConfig,
    private readonly drivingUserPOCDelete: PortDrivingUserPOCDelete,
    private readonly drivingUserPOCInformationDeleteUserId: PortDrivingUserPOCInformationDeleteUserId,
    private readonly logger: PortLogger,
  ) {}

  execute(
    data: PortDrivingUserPOCViewDeleteRequest,
  ): Promise<PortDrivingUserPOCViewDeleteResponse> {
    return tracer.startActiveSpan("user-poc-view-delete.use-case", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-delete.use-case",
        data,
        config: this.config,
      });
      this.logger.info({});
      const { userId: userPOCInformationUserId } =
        await this.drivingUserPOCInformationDeleteUserId.execute({
          userId: data.id,
        });
      this.logger.debug({ userPOCInformationUserId });
      const { id: userPOCId } = await this.drivingUserPOCDelete.execute(data);
      this.logger.debug({ userPOCId });

      return { id: userPOCId };
    });
  }
}
