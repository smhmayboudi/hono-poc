import pino from "pino";

import { config } from "../src/infrastructure/adapter/config/config.ts";
import { database } from "../src/infrastructure/adapter/database/database.ts";
import { userPOCView } from "../src/infrastructure/adapter/database/schema/view/user-poc-view.ts";
import { elasticsearch } from "../src/infrastructure/adapter/elasticsearch/elasticsearch.ts";
import { Logger } from "../src/infrastructure/adapter/logger/logger.ts";

const level = "trace";
const elasticsearch2 = elasticsearch(config, new Logger(pino({ level })));
const database2 = database(config, new Logger(pino({ level })));

const indiceExists = await elasticsearch2
  .client()
  .indices.exists({ index: "user_poc_view" });
if (indiceExists) {
  await elasticsearch2.client().indices.delete({ index: "user_poc_view" });
}
await elasticsearch2.client().indices.create({
  index: "user_poc_view",
  mappings: {
    properties: {
      user_poc_created_at: { type: "date" },
      user_poc_fullname: { type: "text" },
      user_poc_id: { type: "keyword" },
      user_poc_information_address: { type: "text" },
      user_poc_information_age: { type: "integer" },
      user_poc_information_created_at: { type: "date" },
      user_poc_information_id: { type: "text" },
      user_poc_information_updated_at: { type: "date" },
      user_poc_information_user_id: { type: "text" },
      user_poc_updated_at: { type: "date" },
    },
  },
});
const results = await database2.db().select().from(userPOCView).execute();
for (const result of results) {
  await elasticsearch2.client().create({
    body: {
      user_poc_created_at: new Date(String(result.user_poc_created_at)),
      user_poc_fullname: String(result.user_poc_fullname),
      user_poc_id: String(result.user_poc_id),
      user_poc_information_address: String(result.user_poc_information_address),
      user_poc_information_age: Number(result.user_poc_information_age),
      user_poc_information_created_at: new Date(
        String(result.user_poc_information_created_at),
      ),
      user_poc_information_id: String(result.user_poc_information_id),
      user_poc_information_updated_at: new Date(
        String(result.user_poc_information_updated_at),
      ),
      user_poc_information_user_id: String(result.user_poc_information_user_id),
      user_poc_updated_at: new Date(String(result.user_poc_updated_at)),
    },
    id: String(result.user_poc_id),
    index: "user_poc_view",
  });
}
await elasticsearch2.client().close();
