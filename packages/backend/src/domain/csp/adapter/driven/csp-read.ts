import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { count, sql } from "drizzle-orm";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortDatabase } from "../../../../infrastructure/application/port/database/database.ts";
import { csp } from "../../../../infrastructure/application/port/database/schema/schema.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import {
  requestQuery,
  requestQueryCount,
} from "../../../../shared/adapter/driven/request-query.ts";
import type {
  PortDrivenCSPRead,
  PortDrivenCSPReadRequest,
  PortDrivenCSPReadResponse,
} from "../../application/port/driven/csp-read.ts";

export class AdapterDrivenCSPRead implements PortDrivenCSPRead {
  constructor(
    private readonly config: PortConfig,
    private readonly database: PortDatabase,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  read(data: PortDrivenCSPReadRequest): Promise<PortDrivenCSPReadResponse> {
    return this.tracer.startActiveSpan("csp-read.driven", async () => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "csp-read.driven",
        config: this.config,
        data,
      });
      this.logger.info({});
      const result = (
        await requestQuery(
          data,
          (key) => sql`${csp[key as keyof typeof csp]}`,
          this.database.db().select().from(csp),
        ).execute()
      ).map((value) => ({
        timestamp: value.timestamp,
        "csp-report": {
          "blocked-uri": value.cspReportBlockedUri,
          disposition: value.cspReportDisposition,
          "document-uri": value.cspReportDocumentUri,
          "effective-directive": value.cspReportEffectiveDirective,
          "original-policy": value.cspReportOriginalPolicy,
          "script-sample": value.cspReportScriptSample,
          referrer: value.cspReportReferrer,
          "status-code": value.cspReportStatusCode,
          "violated-directive": value.cspReportViolatedDirective,
        },
        id: value.id,
      }));
      this.logger.debug({ result });
      const total = await requestQueryCount(
        data,
        (key) => sql`${csp[key as keyof typeof csp]}`,
        this.database.db().select({ count: count() }).from(csp),
      ).execute();
      this.logger.debug({ result });

      return { data: result, pagination: { total: total[0]?.count ?? 0 } };
    });
  }
}
