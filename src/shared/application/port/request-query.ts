// read more: https://dev.mysql.com/doc/refman/8.4/en/comparison-operators.html
export const COMPARISON_OPERATORS = [
  "!=",
  "<>",
  "<",
  "<=",
  "=",
  ">",
  ">=",
] as const;

export type ComparisonOperator = (typeof COMPARISON_OPERATORS)[number];

// type Join<T extends string[], D extends string> = T extends []
//   ? ""
//   : T extends [infer F extends string]
//     ? F
//     : T extends [infer F extends string, ...infer R extends string[]]
//       ? `${F}${D}${Join<R, D>}`
//       : string;
// type TupleOf<
//   T extends string,
//   N extends number,
//   R extends string[] = [],
// > = R["length"] extends N ? R : TupleOf<T, N, [T, ...R]>;
// type FieldsC<T extends string, N extends number> = Join<TupleOf<T, N>, ",">;
// export type Fields<T extends string> =
//   | FieldsC<T, 1>
//   | FieldsC<T, 2>
//   | FieldsC<T, 3>;
// type SortC<T extends string, N extends number> = Join<
//   TupleOf<T | `-${T}`, N>,
//   ","
// >;
// export type Sort<T extends string> = SortC<T, 1> | SortC<T, 2> | SortC<T, 3>;

export type RequestQuery<D> = {
  expand?: string | undefined;
  // fields?: Fields<keyof D> | undefined;
  fields?: string | undefined;
  filters?:
    | [
        keyof D,
        ComparisonOperator,
        boolean | number | number[] | string | string[],
      ][]
    | undefined;
  limit?: string | undefined;
  offset?: string | undefined;
  // sort?: Sort<keyof D> | undefined;
  sort?: string | undefined;
};
