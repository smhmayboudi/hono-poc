import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../../../infrastructure/application/port/config/config.ts";
import type { PortElasticsearch } from "../../../../infrastructure/application/port/elasticsearch/elasticsearch.ts";
import type { PortLogger } from "../../../../infrastructure/application/port/logger/logger.ts";
import type { PortTracer } from "../../../../infrastructure/application/port/opentelemetry/opentelemetry.ts";
import type {
  PortDrivenUserPOCViewSearch,
  PortDrivenUserPOCViewSearchRequest,
  PortDrivenUserPOCViewSearchResponse,
} from "../../application/port/driven/user-poc-view-search.ts";

interface UserPOCView {
  user_poc_created_at: Date;
  user_poc_fullname: string;
  user_poc_id: string;
  user_poc_information_address: string;
  user_poc_information_age: number;
  user_poc_information_created_at: Date;
  user_poc_information_id: string;
  user_poc_information_updated_at: Date;
  user_poc_information_user_id: string;
  user_poc_updated_at: Date;
}

export class AdapterDrivenUserPOCViewSearch
  implements PortDrivenUserPOCViewSearch
{
  constructor(
    private readonly config: PortConfig,
    private readonly elasticsearch: PortElasticsearch,
    private readonly logger: PortLogger,
    private readonly tracer: PortTracer,
  ) {}

  search(
    data: PortDrivenUserPOCViewSearchRequest,
  ): Promise<PortDrivenUserPOCViewSearchResponse> {
    return this.tracer.startActiveSpan(
      "user-poc-view-search.driven",
      async () => {
        this.logger.assign({
          [ATTR_CODE_FUNCTION_NAME]: "user-poc-view-search.driven",
          config: this.config,
          data,
        });
        this.logger.info({});
        const result = (
          await this.elasticsearch.client().search<UserPOCView>({
            index: "user_poc_view",
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      fields: ["user_poc_fullname"],
                      query: data.query,
                    },
                  },
                ],
              },
            },
          })
        ).hits.hits.map((hit) => ({
          address: hit._source?.user_poc_information_address ?? "",
          age: hit._source?.user_poc_information_age ?? 0,
          fullname: hit._source?.user_poc_fullname ?? "",
          id: hit._source?.user_poc_id ?? "",
        }));
        this.logger.debug({ result });

        return result;
      },
    );
  }
}
