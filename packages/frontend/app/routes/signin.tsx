import { useState } from "react";
import { data, href, redirect, useFetcher, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import Loading from "~/components/ui/loading";
import { commitSession, getSession } from "~/sessions.server";
import { authClient } from "~/utils/auth-client";

import type { Route } from "./+types/signin";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const rememberMe = (form.get("rememberMe") as string) === "on";
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    rememberMe,
  });
  const session = await getSession(request.headers.get("Cookie"));
  if (error) {
    session.flash(
      "error",
      `${error.statusText}[${error.status}] ${error.code}\n${error.message}`,
    );

    return redirect(href("/signin"), {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
  session.set("token", data.token);
  session.set("user", data.user);

  return redirect(href("/"), {
    headers: {
      "Set-Cookie": await commitSession(session, {
        expires: rememberMe
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
      }),
    },
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  console.log("SERVER - loader");
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("token") && session.has("user")) {
    return redirect(href("/"));
  }

  return data(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Signin" },
//   { content: "Signin | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const fetcher = useFetcher<typeof action>();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div>
      {loaderData.error ? (
        <div>
          <p>{loaderData.error}</p>
        </div>
      ) : null}
      <fetcher.Form method="post">
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">Signin</legend>
          <label className="floating-label input validator">
            <Icon c_name="outline-email" className="h-4 opacity-50 w-4" />
            <input
              aria-label="Email"
              name="email"
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              placeholder="Email"
              required
              type="email"
            />
          </label>
          <label className="floating-label input validator">
            <Icon c_name="outline-password" className="h-4 opacity-50 w-4" />
            <input
              aria-label="Password"
              name="password"
              placeholder="Password"
              required
              type={showPassword ? "text" : "password"}
            />
            <Button
              aria-label={showPassword ? "Hide Password" : "Show Password"}
              c_modifier="square"
              c_size="xs"
              c_style="ghost"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              <Icon
                c_name={showPassword ? "outline-eye-off" : "outline-eye"}
                className="h-4 w-4"
              />
            </Button>
          </label>
          <label className="label">
            <input
              aria-label="Remember Me"
              className="toggle"
              name="rememberMe"
              type="checkbox"
            />
            Remember Me
          </label>
          <div className="join">
            <Button
              c_behavior="active"
              c_color="primary"
              c_size="sm"
              className="join-item"
              disabled={busy}
              type="submit"
            >
              {busy ? <Loading c_size="xs" /> : "OK"}
            </Button>
            <Button
              c_size="sm"
              className="join-item"
              onClick={() => {
                navigate(href("/"));
              }}
              type="button"
            >
              CANCEL
            </Button>
          </div>
        </fieldset>
      </fetcher.Form>
    </div>
  );
};
