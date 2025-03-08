import slag from "slugify";

import type { PortSlug } from "../../application/port/slugify/slugify.ts";
import { tracer } from "../opentelemetry/opentelemetry.ts";

export class Slug implements PortSlug {
  constructor(private readonly separator: string = "-") {}

  slugify(...args: unknown[]): string {
    return slag.default(args.join(this.separator), this.separator);
  }
}

export const slug = tracer.startActiveSpan(
  "slug.infrastructure",
  () => new Slug(),
);
