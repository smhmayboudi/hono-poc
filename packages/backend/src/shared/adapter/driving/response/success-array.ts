import { z } from "@hono/zod-openapi";
import type { Context } from "hono";

import type { Env } from "../../../../env.ts";
import { objectPropertiesBuildUrlQueryString } from "../../../../util/object-properties-build-url-query-string.ts";
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

export const successArrayResponseSchema = <
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
    data: z.array(
      z.object({
        attributes: dataAttributesSchema.optional(),
        id: z.string().openapi({ examples: ["id"] }),
        links: dataLinksSchema ?? resourceLinks.optional(),
        meta: dataMetaSchema ?? meta.optional(),
        relationships: dataRelationshipsSchema ?? relationships.optional(),
        type: z.literal(dataTypeSchema),
      }),
    ),
    included: included.optional(),
    jsonapi: jsonapi.optional(),
    links: topLevelLinks.optional(),
    meta: meta.optional(),
  });

export const successArrayResponse = <
  RQ extends z.ZodObject<z.ZodRawShape & { id: z.ZodString }>,
  R extends z.infer<RQ> & { id: string },
>(
  ctx: Context<Env>,
  basePath: string,
  domainType: string,
  requestQuery: z.infer<ReturnType<typeof requestQuerySchema<RQ>>>,
  responses: R[],
  pagination: { total: number },
) => {
  const origin = new URL(ctx.req.url).origin;
  const limit = Number(requestQuery?.limit ?? "0");
  const offset = Number(requestQuery?.offset ?? "0");
  const totalRows = pagination.total;
  const first = `${origin}${basePath}/${domainType}${objectPropertiesBuildUrlQueryString(
    {
      action: "first",
      limit,
      offset,
      totalRows,
    },
    requestQuery,
  )}`;
  const last = `${origin}${basePath}/${domainType}${objectPropertiesBuildUrlQueryString(
    {
      action: "last",
      limit,
      offset,
      totalRows,
    },
    requestQuery,
  )}`;
  const next = `${origin}${basePath}/${domainType}${objectPropertiesBuildUrlQueryString(
    {
      action: "next",
      limit,
      offset,
      totalRows,
    },
    requestQuery,
  )}`;
  const prev = `${origin}${basePath}/${domainType}${objectPropertiesBuildUrlQueryString(
    {
      action: "prev",
      limit,
      offset,
      totalRows,
    },
    requestQuery,
  )}`;
  const self = `${origin}${basePath}/${domainType}${objectPropertiesBuildUrlQueryString(
    {
      action: "self",
      limit,
      offset,
      totalRows,
    },
    requestQuery,
  )}`;

  return ctx.json<z.infer<ReturnType<typeof successArrayResponseSchema>>, 200>(
    {
      data: responses.map((response) => ({
        attributes: objectPropertiesPick(
          response,
          requestQuery?.fields?.split(","),
        ),
        id: response.id,
        links: {
          self: `${origin}${basePath}/${domainType}/${response.id}`,
        },
        type: domainType,
      })),
      jsonapi: { version: "1.0" },
      links: {
        first,
        last,
        next,
        prev,
        self,
      },
      meta: { total: totalRows },
    },
    200,
  );
};
