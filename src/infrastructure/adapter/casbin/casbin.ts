import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { newEnforcer } from "casbin";

import type { PortCasbin } from "../../application/port/casbin/casbin.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Casbin implements PortCasbin {
  enforcer = newEnforcer(
    "./.docker/app/model.conf",
    "./.docker/app/policy.csv",
  );

  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {}

  async authorizer(
    method: string,
    path: string,
    userId: string,
  ): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "authorizer-casbin.infrastructure",
      config: this.config,
      method,
      path,
      userId,
    });
    this.logger.debug({});

    return (await this.enforcer).enforce(userId, path, method);
  }
}

export const casbin = (config: PortConfig, logger: PortLogger) =>
  tracer.startActiveSpan(
    "casbin.infrastructure",
    () => new Casbin(config, logger),
  );
