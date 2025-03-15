import { eq } from "drizzle-orm";

import { userPOCView } from "./infrastructure/adapter/database/schema/view/user-poc-view.ts";
import type { PortCacher } from "./infrastructure/application/port/cacher/cacher.ts";
import type { PortDatabase } from "./infrastructure/application/port/database/database.ts";
import type { PortElasticsearch } from "./infrastructure/application/port/elasticsearch/elasticsearch.ts";
import type { PortEventEmitter } from "./infrastructure/application/port/event-emitter/event-emitter.ts";

export const appEventEmitter = (
  cacher: PortCacher,
  database: PortDatabase,
  elasticsearch: PortElasticsearch,
  eventEmitter: PortEventEmitter,
) => {
  eventEmitter.on("UserPOCUseCaseDelete", (data) => {
    cacher.del(cacher.key({ id: data.request.id }).DrivenUserPOCViewReadID);
  });

  eventEmitter.on("UserPOCUseCaseUpdate", (data) => {
    cacher.del(cacher.key({ id: data.request.id }).DrivenUserPOCViewReadID);
  });

  eventEmitter.on("UserPOCViewUseCaseCreate", async (data) => {
    const results = await database
      .db()
      .select()
      .from(userPOCView)
      .where(eq(userPOCView.user_poc_id, data.response.id))
      .execute();
    for (const result of results) {
      await elasticsearch.client().create({
        body: {
          user_poc_created_at: new Date(String(result.user_poc_created_at)),
          user_poc_fullname: String(result.user_poc_fullname),
          user_poc_id: String(result.user_poc_id),
          user_poc_information_address: String(
            result.user_poc_information_address,
          ),
          user_poc_information_age: Number(result.user_poc_information_age),
          user_poc_information_created_at: new Date(
            String(result.user_poc_information_created_at),
          ),
          user_poc_information_id: String(result.user_poc_information_id),
          user_poc_information_updated_at: new Date(
            String(result.user_poc_information_updated_at),
          ),
          user_poc_information_user_id: String(
            result.user_poc_information_user_id,
          ),
          user_poc_updated_at: new Date(String(result.user_poc_updated_at)),
        },
        id: String(result.user_poc_id),
        index: "user_poc_view",
      });
    }
  });

  eventEmitter.on("UserPOCViewUseCaseDelete", async (data) => {
    await elasticsearch.client().delete({
      id: String(data.request.id),
      index: "user_poc_view",
    });
  });

  eventEmitter.on("UserPOCViewUseCaseUpdate", async (data) => {
    const results = await database
      .db()
      .select()
      .from(userPOCView)
      .where(eq(userPOCView.user_poc_id, data.request.id))
      .execute();
    for (const result of results) {
      await elasticsearch.client().update({
        body: {
          doc: {
            user_poc_created_at: new Date(String(result.user_poc_created_at)),
            user_poc_fullname: String(result.user_poc_fullname),
            user_poc_id: String(result.user_poc_id),
            user_poc_information_address: String(
              result.user_poc_information_address,
            ),
            user_poc_information_age: Number(result.user_poc_information_age),
            user_poc_information_created_at: new Date(
              String(result.user_poc_information_created_at),
            ),
            user_poc_information_id: String(result.user_poc_information_id),
            user_poc_information_updated_at: new Date(
              String(result.user_poc_information_updated_at),
            ),
            user_poc_information_user_id: String(
              result.user_poc_information_user_id,
            ),
            user_poc_updated_at: new Date(String(result.user_poc_updated_at)),
          },
        },
        id: String(result.user_poc_id),
        index: "user_poc_view",
      });
    }
  });
};
