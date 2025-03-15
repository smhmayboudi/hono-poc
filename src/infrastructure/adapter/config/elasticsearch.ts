import type { PortElasticsearch } from "../../application/port/config/elasticsearch.ts";

export class Elasticsearch implements PortElasticsearch {
  constructor(private readonly _node: string) {}

  node(): string {
    return this._node;
  }
}
