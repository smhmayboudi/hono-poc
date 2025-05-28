import { data, href, redirect } from "react-router";

import { commitSession, getSession } from "~/sessions.server";

import type { Route } from "./+types/login";

const validateCredentials = (username: string, password: string) => {
  return Promise.resolve("1234567890");
};

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  const userId = await validateCredentials(username, password);

  if (userId === null) {
    session.flash("error", "Invalid username/password");

    return redirect(href("/login"), {
      headers: {
        "Set-Cookie": await commitSession(session, {
          expires: new Date(Date.now() + 60_000),
        }),
      },
    });
  }
  session.set("userId", userId);

  return redirect(href("/"), {
    headers: {
      "Set-Cookie": await commitSession(session, {
        expires: new Date(Date.now() + 60_000),
      }),
    },
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect(href("/"));
  }

  return data(
    { error: session.get("error") },
    {
      headers: {
        "Set-Cookie": await commitSession(session, {
          expires: new Date(Date.now() + 60_000),
        }),
      },
    },
  );
};

export default ({ loaderData }: Route.ComponentProps) => {
  const { error } = loaderData;

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <form method="POST">
        <div>
          <p>Please sign in</p>
        </div>
        <label>
          Username: <input type="text" name="username" />
        </label>
        <label>
          Password: <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
