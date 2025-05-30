import type { Context, MiddlewareHandler } from "hono";
import type { FlatNamespace, TFunction } from "i18next";
import type { RemixI18NextOption } from "remix-i18next/server";
import { RemixI18Next } from "remix-i18next/server";

import type { Env } from "./app.env";

export interface I18nContext<Ns extends FlatNamespace = "common"> {
  i18n: RemixI18Next;
  locale: string;
  t: TFunction<Ns>;
}
export const I18N_CONTEXT = Symbol.for("i18n-context");

export const i18next =
  <Ns extends FlatNamespace = "common">(
    options: RemixI18NextOption | RemixI18Next,
    defaultNamespace?: Ns,
  ): MiddlewareHandler<Env, "i18next"> =>
  async (ctx, next) => {
    const i18n =
      options instanceof RemixI18Next ? options : new RemixI18Next(options);
    const locale = await i18n.getLocale(ctx.req.raw);
    const t = (await i18n.getFixedT(locale, defaultNamespace)) as TFunction<Ns>;
    ctx.set(I18N_CONTEXT, { i18n, locale, t });
    await next();
  };

i18next.get = (ctx: Context<Env>) => {
  const context = ctx.get(I18N_CONTEXT);
  if (!context) {
    throw new Error(
      "The i18next middleware must run before calling `i18next.get()`",
    );
  }

  return context.i18n;
};

i18next.getFixedT = <Ns extends FlatNamespace = "common">(
  ctx: Context<Env>,
  { namespace }: { namespace?: Ns } = {},
) => {
  if (namespace) {
    const i18n = i18next.get(ctx);
    const locale = i18next.getLocale(ctx);

    return i18n.getFixedT(locale, namespace);
  }
  const context = ctx.get(I18N_CONTEXT);
  if (!context) {
    throw new Error(
      "The i18next middleware must run before calling `i18next.getFixedT()`",
    );
  }

  return Promise.resolve(context.t as TFunction<Ns>);
};

i18next.getLocale = (ctx: Context<Env>) => {
  const context = ctx.get(I18N_CONTEXT);
  if (!context) {
    throw new Error(
      "The i18next middleware must run before calling `i18next.getLocale()`",
    );
  }

  return context.locale;
};
