import type { Hook } from "@hono/zod-openapi";

import type { Env } from "../../../env.ts";
import { zodIsError } from "../../../util/zod-is-error.ts";
import { unprocessableContentResponse } from "./response/unprocessable-content.ts";

export const defaultHook: Hook<unknown, Env, string, unknown> = (
  result,
  ctx,
) => {
  if (!result.success && zodIsError(result)) {
    return unprocessableContentResponse(ctx, result.error.errors);
  }

  return;
};
