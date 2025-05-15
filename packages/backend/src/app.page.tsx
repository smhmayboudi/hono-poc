import type { OpenAPIHono } from "@hono/zod-openapi";
import { type FC, memo, type PropsWithChildren } from "hono/jsx";

import type { Env } from "./env.ts";

export const page = (app: OpenAPIHono<Env>, pagePath: string) => {
  const Header = memo(() => (
    <header>
      <h1>HTTP Status Code Documentation</h1>
      <nav>
        <a href={`${pagePath}/doc/error`}>All Errors</a>
        <a href={`${pagePath}/doc/error/bad-request`}>400</a>
        <a href={`${pagePath}/doc/error/unauthorized`}>401</a>
        <a href={`${pagePath}/doc/error/forbidden`}>403</a>
        <a href={`${pagePath}/doc/error/not-found`}>404</a>
        <a href={`${pagePath}/doc/error/unprocessable-entity`}>422</a>
        <a href={`${pagePath}/doc/error/internal-server-error`}>500</a>
      </nav>
    </header>
  ));

  const Footer = memo(() => (
    <footer>
      <p>
        Powered by <a href="https://github.com/honojs/hono">Hono</a> | HTTP
        Status Code Reference
      </p>
    </footer>
  ));

  interface Props {
    title: string;
  }

  const Layout: FC<PropsWithChildren<Props>> = ({ children, title }) => (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
        />
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
            }
            header {
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 1rem;
              margin-bottom: 2rem;
            }
            header nav {
              display: flex;
              gap: 1rem;
              margin-top: 1rem;
            }
            header nav a {
              text-decoration: none;
              color: #2563eb;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
            }
            header nav a:hover {
              background-color: #eff6ff;
            }
            .error-card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 1.5rem;
              margin-bottom: 1.5rem;
              background-color: #f8fafc;
            }
            .error-code {
              font-weight: bold;
              font-size: 1.25rem;
              margin-bottom: 0.5rem;
            }
            .error-title {
              font-size: 1.5rem;
              margin-bottom: 0.75rem;
              color: #dc2626;
            }
            .error-description {
              margin-bottom: 1rem;
            }
            .back-link {
              display: inline-block;
              margin-top: 1rem;
              color: #2563eb;
              text-decoration: none;
            }
            .back-link:hover {
              text-decoration: underline;
            }
            footer {
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #64748b;
            }
          `}
        </style>
      </head>
      <body style="padding: 1em 2em">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );

  // Define all HTTP errors with more detailed information
  const httpErrors = {
    badRequest: {
      code: 400,
      title: "Bad Request",
      description:
        "The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).",
      solution:
        "Check your request syntax, headers, and body content. Ensure all required parameters are included and properly formatted.",
    },
    unauthorized: {
      code: 401,
      title: "Unauthorized",
      description:
        "The request has not been applied because it lacks valid authentication credentials for the target resource.",
      solution:
        "Include proper authentication credentials. This might involve adding an API key, OAuth token, or other authentication headers.",
    },
    forbidden: {
      code: 403,
      title: "Forbidden",
      description:
        "The server understood the request but refuses to authorize it. This status is similar to 401, but in this case, re-authenticating will make no difference.",
      solution:
        "Check your permissions. If you believe you should have access, contact the system administrator.",
    },
    notFound: {
      code: 404,
      title: "Not Found",
      description:
        "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
      solution:
        "Verify the URL or resource path. Check for typos. If you expect the resource to exist, it may have been moved or deleted.",
    },
    unprocessableEntity: {
      code: 422,
      title: "Unprocessable Entity",
      description:
        "The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.",
      solution:
        "Check your request payload for semantic errors. This often occurs with validation errors in API requests.",
    },
    internalServerError: {
      code: 500,
      title: "Internal Server Error",
      description:
        "The server encountered an unexpected condition that prevented it from fulfilling the request.",
      solution:
        "This is typically a server-side issue. Try again later. If the problem persists, contact the service administrator.",
    },
  };

  // Error documentation page showing all errors
  const ErrorDocs: FC = () => (
    <Layout title="HTTP Status Code Documentation">
      <h2>HTTP Error Status Codes</h2>
      <p>
        This documentation provides details about common HTTP error status codes
        you might encounter.
      </p>
      <div>
        {Object.values(httpErrors).map((value, index) => (
          <div key={index} class="error-card">
            <div class="error-code">{value.code}</div>
            <h3 class="error-title">{value.title}</h3>
            <p class="error-description">{value.description}</p>
            <p>
              <strong>Suggested solution:</strong> {value.solution}
            </p>
            <a
              href={`${pagePath}/doc/error/${value.title.toLowerCase().replace(/\s+/g, "-")}`}
              class="back-link"
            >
              Detailed documentation →
            </a>
          </div>
        ))}
      </div>
    </Layout>
  );

  // Individual error page template
  const ErrorPage: FC<{
    error: (typeof httpErrors)[keyof typeof httpErrors];
  }> = ({ error }) => (
    <Layout title={`${error.code} ${error.title} Documentation`}>
      <div class="error-card">
        <h2 class="error-title">
          {error.code} - {error.title}
        </h2>
        <div class="error-description">
          <p>{error.description}</p>
          <h3>When this occurs:</h3>
          <ul>
            {error.code === 400 && (
              <>
                <li>Malformed request syntax</li>
                <li>Invalid request message framing</li>
                <li>Missing required parameters</li>
              </>
            )}
            {error.code === 401 && (
              <>
                <li>No authentication credentials provided</li>
                <li>Invalid or expired credentials</li>
                <li>Authentication scheme not supported</li>
              </>
            )}
            {error.code === 403 && (
              <>
                <li>Insufficient permissions</li>
                <li>IP address blocked</li>
                <li>Resource access restricted to specific users</li>
              </>
            )}
            {error.code === 404 && (
              <>
                <li>Resource was moved or deleted</li>
                <li>URL contains a typo</li>
                <li>API endpoint doesn't exist</li>
              </>
            )}
            {error.code === 422 && (
              <>
                <li>Validation errors in request payload</li>
                <li>Semantic errors in request data</li>
                <li>Missing required fields in JSON body</li>
              </>
            )}
            {error.code === 500 && (
              <>
                <li>Server configuration issues</li>
                <li>Unhandled exceptions in application code</li>
                <li>Database connection problems</li>
              </>
            )}
          </ul>
          <h3>How to resolve:</h3>
          <p>{error.solution}</p>
        </div>
        <a href={`${pagePath}/doc/error`} class="back-link">
          ← Back to all status codes
        </a>
      </div>
    </Layout>
  );

  // Main error documentation page
  app.get(`${pagePath}/doc/error`, (ctx) => {
    return ctx.html(<ErrorDocs />);
  });

  // Individual error pages
  app.get(`${pagePath}/doc/error/bad-request`, (ctx) => {
    return ctx.html(<ErrorPage error={httpErrors.badRequest} />);
  });

  app.get(`${pagePath}/doc/error/unauthorized`, (ctx) => {
    return ctx.html(<ErrorPage error={httpErrors.unauthorized} />);
  });

  app.get(`${pagePath}/doc/error/forbidden`, (ctx) => {
    return ctx.html(<ErrorPage error={httpErrors.forbidden} />);
  });

  app.get(`${pagePath}/doc/error/not-found`, (ctx) => {
    return ctx.html(<ErrorPage error={httpErrors.notFound} />);
  });

  app.get(`${pagePath}/doc/error/unprocessable-entity`, (ctx) => {
    return ctx.html(<ErrorPage error={httpErrors.unprocessableEntity} />);
  });

  app.get(`${pagePath}/doc/error/internal-server-error`, (ctx) => {
    return ctx.html(<ErrorPage error={httpErrors.internalServerError} />);
  });
};
