export const objectPropertiesBuildUrlQueryString = <
  T extends Record<string, unknown>,
>(
  params?: T,
): string => {
  if (!params) {
    return "";
  }
  const queryString = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const serializedValue = value
          .filter((element) => Array.isArray(element))
          .map((element) => element.join(":"))
          .join(",");
        return `${key}=${serializedValue}`;
      }
      return `${key}=${String(value)}`;
    })
    .join("&");

  return queryString === "" ? "" : `?${queryString}`;
};
