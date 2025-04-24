import * as slag from "slugify";

import type { PortTracer } from "../../application/port/opentelemetry/opentelemetry.ts";
import type { PortSlug } from "../../application/port/slugify/slugify.ts";

export class Slug implements PortSlug {
  constructor(private readonly separator: string = "-") {}

  slugify(...args: unknown[]): string {
    return slag.default(args.join(this.separator), this.separator);
  }
}

export const slug = (tracer: PortTracer) =>
  tracer.startActiveSpan("slug.infrastructure", () => new Slug());
