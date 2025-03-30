import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { type Enforcer, newEnforcer } from "casbin";

import type { PortCasbin } from "../../application/port/casbin/casbin.ts";
import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortDatabase } from "../../application/port/database/database.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";
import { CasbinDrizzleAdapter } from "./casbin-drizzle-adapter.ts";

export class Casbin implements PortCasbin {
  constructor(
    private readonly config: PortConfig,
    private readonly enforcer: Promise<Enforcer>,
    private readonly logger: PortLogger,
  ) {}

  async addGroupingPolicy(...params: string[]): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "add-grouping-policy-casbin.infrastructure",
      config: this.config,
      params,
    });
    this.logger.debug({});
    const enforcer = await this.enforcer;

    return enforcer.addGroupingPolicy(...params);
  }

  async addPolicies(rules: string[][]): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "add-policies-casbin.infrastructure",
      config: this.config,
      rules,
    });
    this.logger.debug({});
    const enforcer = await this.enforcer;

    return enforcer.addPolicies(rules);
  }

  async enforce(
    method: string,
    path: string,
    userId: string,
  ): Promise<boolean> {
    this.logger.assign({
      [ATTR_CODE_FUNCTION_NAME]: "enforce-casbin.infrastructure",
      config: this.config,
      method,
      path,
      userId,
    });
    this.logger.debug({});
    const enforcer = await this.enforcer;

    return enforcer.enforce(userId, path, method);
  }
}

export const casbin = (
  config: PortConfig,
  database: PortDatabase,
  logger: PortLogger,
) =>
  tracer.startActiveSpan("casbin.infrastructure", () => {
    const enforcer = newEnforcer(
      "./.docker/app/model.conf",
      // "./.docker/app/policy.csv",
      new CasbinDrizzleAdapter(database),
      // true,
    );

    return new Casbin(config, enforcer, logger);
  });
