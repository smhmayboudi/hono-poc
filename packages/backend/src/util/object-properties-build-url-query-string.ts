import type { z } from "@hono/zod-openapi";

import type { requestQuerySchema } from "../shared/adapter/driving/request-query.ts";

export const objectPropertiesBuildUrlQueryString = <
  RQ extends z.ZodObject<z.ZodRawShape>,
>(
  pagination?: {
    action: "first" | "last" | "next" | "prev" | "self";
    limit?: number;
    offset?: number;
    totalRows?: number;
  },
  params?: z.infer<ReturnType<typeof requestQuerySchema<RQ>>>,
): string => {
  if (!params) {
    return "?limit=0&offset=0";
  }
  if (pagination) {
    const { action, limit, offset, totalRows } = pagination;
    if (limit !== undefined) {
      params.limit = limit.toString();
    }
    if (offset !== undefined) {
    }
    switch (action) {
      case "first":
        params.offset = "0";
        break;
      case "last":
        if (limit !== undefined && totalRows !== undefined) {
          const lastPageOffset =
            limit === 0 ? 0 : Math.ceil(totalRows / limit) - 1;
          params.offset = lastPageOffset.toString();
        }
        break;
      case "next":
        if (
          offset !== undefined &&
          limit !== undefined &&
          totalRows !== undefined
        ) {
          const lastPageOffset =
            limit === 0 ? 0 : Math.ceil(totalRows / limit) - 1;
          params.offset = Math.min(offset + 1, lastPageOffset).toString();
        }
        break;
      case "prev":
        if (
          offset !== undefined &&
          limit !== undefined &&
          totalRows !== undefined
        ) {
          params.offset = Math.max(0, offset - 1).toString();
        }
        break;
      case "self":
        break;
    }
  }
  const queryString = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const serializedValue = value
          .filter((element) => Array.isArray(element))
          .map((element) => element.join(":"))
          .join(",");
        return `${key}=${serializedValue}`;
      }
      return `${key}=${String(value)}`;
    })
    .join("&");

  return queryString === "" ? "" : `?${queryString}`;
};
