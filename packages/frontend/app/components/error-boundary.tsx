import { isRouteErrorResponse, useRouteError } from "react-router";

export default () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <p>{error.name}</p>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
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
