import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@react-router/node";
import { createInstance } from "i18next";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type {
  AppLoadContext,
  EntryContext,
  HandleErrorFunction,
} from "react-router";
import { ServerRouter } from "react-router";

import { AuthProvider } from "~/components/auth-provider";
import i18n from "~/localization/i18n";
import i18nextOpts from "~/localization/i18n.server";
import { resources } from "~/localization/resource";

import { getSession } from "./sessions.server";

// export const handleDataRequest = (
//   response: Response,
//   { request, params, context }: LoaderFunctionArgs | ActionFunctionArgs,
// ) => {
//   response.headers.set("X-Custom-Header", "value");
// 
//   return response;
// };

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (!request.signal.aborted) {
    // myReportError(error);
    console.error(error);
  }
};

export const streamTimeout = 10_000;

export default (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
  // loadContext: unstable_RouterContextProvider // middleware enabled
) =>
  new Promise(async (resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";
    const cookie = request.headers.get("Cookie") || "";
    const session = await getSession(cookie);
    const instance = createInstance();
    const lng = loadContext.locale;
    const ns = i18nextOpts.getRouteNamespaces(routerContext);
    await instance.use(initReactI18next).init({
      ...i18n,
      lng,
      ns,
      resources,
    });

    const { abort, pipe } = renderToPipeableStream(
      // @ts-ignore
      <I18nextProvider i18n={instance}>
        <AuthProvider serverSession={session.data}>
          <ServerRouter context={routerContext} url={request.url} />
        </AuthProvider>
      </I18nextProvider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );
    setTimeout(abort, streamTimeout + 1000);
  });
