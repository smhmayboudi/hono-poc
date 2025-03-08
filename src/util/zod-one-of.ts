import type { z } from "@hono/zod-openapi";

export const zodOneOf = <
  A,
  K1 extends Extract<keyof A, string>,
  K2 extends Extract<keyof A, string>,
  R extends A &
    (
      | (Required<Pick<A, K1>> & { [P in K2]: undefined })
      | (Required<Pick<A, K2>> & { [P in K1]: undefined })
    ),
>(
  schema: z.ZodType<A>,
  key1: K1,
  key2: K2,
): z.ZodEffects<z.ZodType<A>, R> =>
  schema.refine((arg): arg is R => !!arg[key1] !== !!arg[key2], {
    message: `Either ${key1} or ${key2} must be filled, but not both`,
    path: [key1, key2],
  });
