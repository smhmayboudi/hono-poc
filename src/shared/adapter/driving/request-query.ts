import { z } from "@hono/zod-openapi";

import {
  COMPARISON_OPERATORS,
  type RequestQuery,
} from "../../application/port/request-query.ts";

export const requestQuerySchema = <D extends z.AnyZodObject>(schema: D) => {
  const fieldKeys = Object.keys(schema.shape) as [keyof z.infer<typeof schema>];
  const operatorFormat = (operator: string) => `:${operator}:`;

  return z
    .object({
      expand: z
        .string({})
        .optional()
        .openapi({
          description: "Auto expand record relations",
          examples: ["relativeField1,relativeField2.subRelativeField"],
        }),
      fields: z
        .string()
        .refine(
          (arg) =>
            typeof arg === "string"
              ? arg
                  .split(",")
                  .map((value) => fieldKeys.includes(value))
                  .reduce(
                    (previousValue, currentValue) =>
                      previousValue && currentValue,
                    true,
                  )
              : !arg,
          {
            message: `Fields must be a comma-separated list of: ${fieldKeys.join(",")}`,
          },
        )
        .optional()
        .openapi({
          description:
            "Comma separated string of the fields to return in the JSON response (by default returns all fields)",
          examples: [`${fieldKeys.join(",")}`],
        }),
      filters: z
        .string()
        .regex(/^\w+:=:\w+(,\w+:=:\w+)*$/, {
          message:
            'String must be in the format "left:=:right" or "left1:=:right1,left2:=:right2"',
        })
        .refine(
          (arg) =>
            arg
              .split(",")
              .map((value) => {
                const operator = COMPARISON_OPERATORS.find((operator) =>
                  value.includes(operatorFormat(operator)),
                );
                if (!operator) {
                  return false;
                }
                const [key, val] = value.split(operatorFormat(operator));
                if (!(key && val)) {
                  return false;
                }

                return fieldKeys.includes(key) && val !== "";
              })
              .every((isValid) => isValid),
          {
            message: `Filters must be a comma-separated list of field-value pairs: ${fieldKeys.join(",")}`,
          },
        )
        .transform((data) => {
          const parsedFilters: RequestQuery<z.infer<D>>["filters"] = [];
          const filters = data.split(",");
          for (const filter of filters) {
            const operator = COMPARISON_OPERATORS.find((operator) =>
              filter.includes(operatorFormat(operator)),
            );
            if (!operator) {
              continue;
            }
            const [key, val] = filter.split(operatorFormat(operator));
            if (!(key && val)) {
              continue;
            }
            parsedFilters.push([key.trim(), operator, val.trim()]);
          }

          return parsedFilters;
        })
        .optional()
        .openapi({
          description: "Comma separated string of filters, e.g., field=value",
          examples: [
            fieldKeys
              .map((key) => `${String(key)}${operatorFormat("=")}value`)
              .join(","),
          ],
        }),
      limit: z
        .string()
        .refine((arg) => !Number.isNaN(Number(arg)) && Number(arg) >= 1, {
          message:
            "The string must be a valid number greater than or equal to 1",
        })
        .optional()
        .openapi({
          description: "The max returned records per request",
          examples: ["1"],
        }),
      offset: z
        .string()
        .refine((arg) => !Number.isNaN(Number(arg)) && Number(arg) >= 0, {
          message:
            "The string must be a valid number greater than or equal to 0",
        })
        .optional()
        .openapi({
          description: "The offset returned records per request",
          examples: ["0"],
        }),
      sort: z
        .string()
        .refine(
          (arg) =>
            typeof arg === "string"
              ? arg
                  .split(",")
                  .map((value) =>
                    value.startsWith("-")
                      ? fieldKeys.includes(value.slice(1))
                      : fieldKeys.includes(value),
                  )
                  .reduce(
                    (previousValue, currentValue) =>
                      previousValue && currentValue,
                    true,
                  )
              : !arg,
          {
            message: `Sort must be a comma-separated list of fields (optionally prefixed with '-'): ${fieldKeys.join(",")}`,
          },
        )
        .optional()
        .openapi({
          description:
            "Specify the ORDER BY fields, add - / + (default) in front of the attribute for DESC / ASC order",
          examples: [fieldKeys.map((key) => `-${String(key)}`).join(",")],
        }),
    })
    .strict();
};
