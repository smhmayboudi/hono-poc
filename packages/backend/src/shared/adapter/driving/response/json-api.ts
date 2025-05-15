import { z } from "@hono/zod-openapi";

// https://github.com/json-api/json-api/blob/gh-pages/_schemas/1.0/schema.json

const memberName = z.string().regex(/^[a-zA-Z0-9](?:[-\w]*[a-zA-Z0-9])?$/);

export const meta = z.record(memberName, z.any()).refine((val) => {
  return Object.keys(val).every((key) => memberName.safeParse(key).success);
});

const linkUrl = z
  .string()
  .regex(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);

const linkObject = z.object({
  href: linkUrl,
  meta: meta.optional(),
});

const link = z.union([linkUrl, linkObject]);

const resourceIdentifier = z.object({
  id: z.string(),
  meta: meta.optional(),
  type: z.string().regex(/^[a-zA-Z0-9](?:[-\w]*[a-zA-Z0-9])?$/),
});

const relationshipToOne = z.union([z.null(), resourceIdentifier]);

const relationshipToMany = z.array(resourceIdentifier);

const linkage = z.union([relationshipToOne, relationshipToMany]);

const relationshipLinks = z.object({
  first: link.optional(),
  last: link.optional(),
  next: link.optional(),
  prev: link.optional(),
  related: link.optional(),
  self: link.optional(),
});

const relationship = z
  .object({
    data: linkage.optional(),
    links: relationshipLinks.optional(),
    meta: meta.optional(),
  })
  .refine((val) => val.data || val.meta || val.links, {
    message: "At least one of 'data', 'meta', or 'links' must be present",
  });

export const relationships = z.record(memberName, relationship);

const attributes = z.record(memberName, z.any()).refine(
  (val) => {
    return !(val["type"] || val["id"]);
  },
  {
    message: "Attributes must not contain 'type' or 'id'",
  },
);

export const resourceLinks = z.object({
  self: link.optional(),
});

const resource = z.object({
  attributes: attributes.optional(),
  id: z.string().optional(),
  links: resourceLinks.optional(),
  meta: meta.optional(),
  relationships: relationships.optional(),
  type: z.string().regex(/^[a-zA-Z0-9](?:[-\w]*[a-zA-Z0-9])?$/),
});

const resourceCollection = z.array(resource);

const data = z.union([resource, resourceCollection, z.null()]);

export const errorLinks = z.object({
  about: link.optional(),
});

const error = z.object({
  code: z.string().optional(),
  detail: z.string().optional(),
  id: z.string().optional(),
  links: errorLinks.optional(),
  meta: meta.optional(),
  source: z
    .object({
      pointer: z
        .string()
        .regex(/^(?:\/(?:[^~/]|~0|~1)*)*$/)
        .optional(),
      parameter: z.string().optional(),
    })
    .optional(),
  status: z.string().optional(),
  title: z.string().optional(),
});

const errors = z
  .array(error)
  .refine((val) => new Set(val).size === val.length, {
    message: "Errors must be unique",
  });

export const included = z
  .array(resource)
  .refine((val) => new Set(val).size === val.length, {
    message: "Included resources must be unique",
  });

export const jsonapi = z.object({
  version: z.string().optional(),
  meta: meta.optional(),
});

export const topLevelLinks = z.object({
  first: link.optional(),
  last: link.optional(),
  next: link.optional(),
  prev: link.optional(),
  related: link.optional(),
  self: link.optional(),
});

export const jsonApiSchema = z
  .object({
    data: data.optional(),
    errors: errors.optional(),
    included: included.optional(),
    jsonapi: jsonapi.optional(),
    links: topLevelLinks.optional(),
    meta: meta.optional(),
  })
  .refine((val) => !(val.data && val.errors), {
    message: "Only one of 'data' or 'errors' can be present",
  })
  .refine((val) => val.data || val.errors || val.meta, {
    message: "At least one of 'data', 'errors', or 'meta' must be present",
  })
  .refine((val) => !(val.included && !val.data), {
    message: "'included' can only be present if 'data' is present",
  });
