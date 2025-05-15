import type { Context, Span, SpanOptions } from "@opentelemetry/api";

export type SpanName<M extends string> =
  `${M}.${"driven" | "driving" | "infrastructure" | "use-case"}`;

export interface PortTracer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startActiveSpan<M extends string, F extends (span?: Span) => any>(
    name: SpanName<M>,
    optionsOrFn: SpanOptions | F,
    contextOrFn?: Context | F,
    fn?: F,
  ): ReturnType<F> extends Promise<infer U> ? Promise<U> : ReturnType<F>;
}
