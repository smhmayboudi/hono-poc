import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { csp } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenCSPCreate,
  PortDrivenCSPCreateRequest,
  PortDrivenCSPCreateResponse,
} from "../../application/port/driven/csp-create.ts";

export class AdapterDrivenCSPCreate implements PortDrivenCSPCreate {
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  create(
    data: PortDrivenCSPCreateRequest,
  ): Promise<PortDrivenCSPCreateResponse> {
    return this.tracer.startActiveSpan("csp-create.driven", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "csp-create.driven",
        config: this.config,
        data,
      });
      this.logger.info({});
      const result = await this.database
        .db()
        .insert(csp)
        .values({
          id: data.id,
          timestamp: data.timestamp,
          cspReportBlockedUri: data["csp-report"]["blocked-uri"],
          cspReportDisposition: data["csp-report"]["disposition"],
          cspReportDocumentUri: data["csp-report"]["document-uri"],
          cspReportEffectiveDirective:
            data["csp-report"]["effective-directive"],
          cspReportOriginalPolicy: data["csp-report"]["original-policy"],
          cspReportScriptSample: data["csp-report"]["script-sample"],
          cspReportReferrer: data["csp-report"]["referrer"],
          cspReportStatusCode: data["csp-report"]["status-code"],
          cspReportViolatedDirective: data["csp-report"]["violated-directive"],
        })
        .execute();
      this.logger.debug({ result });
    });
  }
}
