import { useState } from "react";
import { data, href, redirect, useFetcher, useNavigate } from "react-router";
import { z } from "zod";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import Loading from "~/components/ui/loading";
import { commitSession, getSession } from "~/sessions.server";
import { authClient } from "~/utils/auth-client";

import type { Route } from "./+types/signup";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("SERVER - action");
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const formData = await request.formData();
    const user = z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    });
    const dataIn = user.parse(Object.fromEntries(formData));
    const { data, error } = await authClient.signUp.email(dataIn);
    if (error) {
      throw error;
    }
    session.set("token", data.token ?? undefined);
    session.set("user", data.user);

    return redirect(href("/"), {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    session.flash("error", String(error));

    return redirect(href("/signup"), {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
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
//   { title: "Signup" },
//   { content: "Signup | description", name: "description" },
// ];

export default ({ loaderData }: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const auth = useAuth();
  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const user = z.object({
  //     email: z.string().email(),
  //     password: z.string(),
  //     name: z.string(),
  //   });
  //   const data = user.parse(Object.fromEntries(formData));
  //   auth.signUp(data.email, data.name, data.password, () => {
  //     navigate(href("/signin"));
  //   });
  // };

  return (
    <div>
      {loaderData.error ? (
        <div>
          <p>{loaderData.error}</p>
        </div>
      ) : null}
      <fetcher.Form method="post">
        <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
          <legend className="fieldset-legend">Signup</legend>
          <label className="floating-label input validator">
            <Icon c_name="outline-username" className="h-4 opacity-50 w-4" />
            <input
              aria-label="Name"
              name="name"
              placeholder="Name"
              required
              type="text"
            />
          </label>
          <label className="floating-label input validator">
            <Icon c_name="outline-email" className="h-4 opacity-50 w-4" />
            <input
              aria-label="Email"
              name="email"
              placeholder="Email"
              required
              type="text"
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
