/**
 * Helper utility used to extract the domain from the request even if it's
 * behind a proxy. This is useful for sitemaps and other things.
 * @param request Request object
 * @returns Current domain
 */
export const createDomain = (request: Request) => {
  const headers = request.headers;
  const maybeProto = headers.get("x-forwarded-proto");
  const maybeHost = headers.get("host");
  const url = new URL(request.url);
  if (maybeProto) {
    return `${maybeProto}://${maybeHost ?? url.host}`;
  }
  if (url.hostname === "localhost") {
    return `http://${url.host}`;
  }

  return `https://${url.host}`;
};
