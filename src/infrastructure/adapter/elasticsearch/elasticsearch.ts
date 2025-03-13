import { Client } from "@elastic/elasticsearch";
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating";

import type { PortConfig } from "../../application/port/config/config.ts";
import type { PortElasticsearch } from "../../application/port/elasticsearch/elasticsearch.ts";
import type { PortLogger } from "../../application/port/logger/logger.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export type Index<K extends string, T> = Record<K, T>;

export class Elasticsearch implements PortElasticsearch {
  private readonly _client: Client;

  constructor(
    private readonly config: PortConfig,
    private readonly logger: PortLogger,
  ) {
    this._client = new Client({
      node: "http://127.0.0.1:9200",
    });

    this._client.diagnostic.on("deserialization", (error, result) => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "elasticsearch.deserialization",
        config: this.config,
      });
      if (error) {
        this.logger.error({ error });
      } else {
        this.logger.debug({ result });
      }
    });

    this._client.diagnostic.on("request", (error, result) => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "elasticsearch.request",
        config: this.config,
      });
      if (error) {
        this.logger.error({ error });
      } else {
        this.logger.debug({ result });
      }
    });

    this._client.diagnostic.on("response", (error, result) => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "elasticsearch.response",
        config: this.config,
      });
      if (error) {
        this.logger.error({ error });
      } else {
        this.logger.debug({ result });
      }
    });

    this._client.diagnostic.on("resurrect", (error, result) => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "elasticsearch.resurrect",
        config: this.config,
      });
      if (error) {
        this.logger.error({ error });
      } else {
        this.logger.debug({ result });
      }
    });

    this._client.diagnostic.on("serialization", (error, result) => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "elasticsearch.serialization",
        config: this.config,
      });
      if (error) {
        this.logger.error({ error });
      } else {
        this.logger.debug({ result });
      }
    });

    this._client.diagnostic.on("sniff", (error, result) => {
      this.logger.assign({
        [ATTR_CODE_FUNCTION_NAME]: "elasticsearch.sniff",
        config: this.config,
      });
      if (error) {
        this.logger.error({ error });
      } else {
        this.logger.debug({ result });
      }
    });
  }

  client(): Client {
    return this._client;
  }
}

export const elasticsearch = (config: PortConfig, logger: PortLogger) =>
  tracer.startActiveSpan(
    "elasticsearch.infrastructure",
    () => new Elasticsearch(config, logger),
  );
