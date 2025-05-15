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
