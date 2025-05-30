import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRouteError } from "react-router";

export default () => {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
        <p>{t(`error.${error.status}.title`)}</p>
        <p>{t(`error.${error.status}.description`)}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <p>{error.name}</p>
        <p>{error.message}</p>
        <pre>
          <code>{error.stack}</code>
        </pre>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Unknown Error</h1>
      </div>
    );
  }
};
