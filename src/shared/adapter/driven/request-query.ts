import {
  and,
  asc,
  type ColumnsSelection,
  desc,
  eq,
  gt,
  gte,
  lt,
  lte,
  ne,
  type SQL,
} from "drizzle-orm";
import type {
  MySqlSelectBase,
  PreparedQueryHKTBase,
} from "drizzle-orm/mysql-core";
import type {
  JoinNullability,
  SelectMode,
} from "drizzle-orm/query-builders/select.types";

import type { RequestQuery } from "../../application/port/request-query.ts";

const applyExpand = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
  expand: RequestQuery<D>["expand"],
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  if (expand) {
    throw new Error("implement expand logic here");
  }
  return query;
};

const applyFields = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
  fields: RequestQuery<D>["fields"],
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  if (fields) {
    throw new Error("implement expand logic here");
  }
  return query;
};

const applyFilters = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
  filters: RequestQuery<D>["filters"],
  mapField: (key: keyof D) => SQL<TSelection>,
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  if (filters) {
    const conditions = filters.map(([field, operator, value]) => {
      const mappedField = mapField(field);
      switch (operator) {
        case "!=":
        case "<>":
          return ne(mappedField, value);
        case "<":
          return lt(mappedField, value);
        case "<=":
          return lte(mappedField, value);
        case "=":
          return eq(mappedField, value);
        case ">":
          return gt(mappedField, value);
        case ">=":
          return gte(mappedField, value);
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    });
    // @ts-ignore
    query = query.where(and(...conditions));
  }
  return query;
};

const applyLimit = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
  limit: RequestQuery<D>["limit"],
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  if (limit) {
    // @ts-ignore
    query = query.limit(Number(limit));
  }
  return query;
};

const applyOffset = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
  offset: RequestQuery<D>["offset"],
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  if (offset) {
    // @ts-ignore
    query = query.offset(Number(offset));
  }
  return query;
};

const applySort = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
  sort: RequestQuery<D>["sort"],
  mapField: (key: keyof D) => SQL<TSelection>,
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  if (sort) {
    const conditions = sort.split(",").map((value) => {
      const isDescending = value.startsWith("-");
      const field = isDescending ? value.slice(1) : value;
      const mappedField = mapField(field as keyof D);
      return isDescending ? desc(mappedField) : asc(mappedField);
    });
    // @ts-ignore
    query = query.orderBy(...conditions);
  }
  return query;
};

export const requestQuery = <
  D,
  TTableName extends string,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode,
  TPreparedQueryHKT extends PreparedQueryHKTBase,
  TNullabilityMap extends Record<string, JoinNullability>,
>(
  requestQuery: RequestQuery<D>,
  mapField: (key: keyof D) => SQL<TSelection>,
  query: MySqlSelectBase<
    TTableName,
    TSelection,
    TSelectMode,
    TPreparedQueryHKT,
    TNullabilityMap
  >,
): MySqlSelectBase<
  TTableName,
  TSelection,
  TSelectMode,
  TPreparedQueryHKT,
  TNullabilityMap
> => {
  query = applyExpand(query, requestQuery.expand);
  query = applyFields(query, requestQuery.fields);
  query = applyFilters(query, requestQuery.filters, mapField);
  query = applyLimit(query, requestQuery.limit);
  query = applyOffset(query, requestQuery.offset);
  query = applySort(query, requestQuery.sort, mapField);

  return query;
};
