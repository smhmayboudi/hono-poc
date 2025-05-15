import type { Client } from "@elastic/elasticsearch";

export interface PortElasticsearch {
  client(): Client;
}
