import { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { objectPropertiesPick } from "../../../../util/object-properties-pick.ts";
import type { requestQuerySchema } from "../request-query.ts";
import {
  included,
  jsonapi,
  meta,
  relationships,
  resourceLinks,
  topLevelLinks,
} from "./json-api.ts";

export const successResponseSchema = <
  DA extends z.ZodTypeAny,
  DL extends z.ZodTypeAny = z.ZodUndefined,
  DM extends z.ZodTypeAny = z.ZodUndefined,
  DRM extends z.ZodTypeAny = z.ZodUndefined,
>(
  dataAttributesSchema: DA,
  dataTypeSchema: string,
  dataLinksSchema?: DL,
  dataMetaSchema?: DM,
  dataRelationshipsSchema?: DRM,
) =>
  z.object({
    data: z.object({
      attributes: dataAttributesSchema,
      id: z.string().openapi({ examples: ["id"] }),
      links: dataLinksSchema ?? resourceLinks.optional(),
      meta: dataMetaSchema ?? meta.optional(),
      relationships: dataRelationshipsSchema ?? relationships.optional(),
      type: z.literal(dataTypeSchema),
    }),
    included: included.optional(),
    jsonapi: jsonapi.optional(),
    links: topLevelLinks.optional(),
    meta: meta.optional(),
  });

export const successResponse = <
  RQ extends z.ZodObject<z.ZodRawShape & { id: z.ZodString }>,
  R extends z.infer<RQ> & { id: string },
>(
  ctx: Context<Env>,
  basePath: string,
  domainType: string,
  response: R,
  statusCode200: boolean,
  requestQuery?: z.infer<ReturnType<typeof requestQuerySchema<RQ>>>,
) =>
  ctx.json<z.infer<ReturnType<typeof successResponseSchema>>, 200 | 201>(
    {
      data: {
        attributes: objectPropertiesPick(
          response,
          requestQuery?.fields?.split(","),
        ),
        id: response.id,
        links: {
          self: `${new URL(ctx.req.url).origin}${basePath}/${domainType}/${response.id}`,
        },
        type: domainType,
      },
      jsonapi: { version: "1.0" },
    },
    statusCode200 ? 200 : 201,
  );
