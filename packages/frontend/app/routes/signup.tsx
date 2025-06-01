import { useState } from "react";
import { href, useFetcher, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import Loading from "~/components/ui/loading";
import { authClient } from "~/utils/auth-client";

import type { Route } from "./+types/signup";

export const clientAction = async ({ request }: Route.ActionArgs) => {
  console.log("CLIENT - clientAction");
  const form = await request.formData();
  const email = form.get("email") as string;
  const name = form.get("name") as string;
  const password = form.get("password") as string;
  const { data, error } = await authClient.signUp.email({
    email,
    name,
    password,
  });

  return { data, error };
};

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Signup" },
//   { content: "Signup | description", name: "description" },
// ];

export default ({}: Route.ComponentProps) => {
  const fetcher = useFetcher<typeof clientAction>();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
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
      {fetcher.data?.data ? (
        <div>
          <p>User {fetcher.data.data.user.email} created.</p>
        </div>
      ) : (
        <></>
      )}
      {fetcher.data?.error ? (
        <div>
          <h1>
            {fetcher.data.error.statusText}[{fetcher.data.error.status}
            ]&nbsp;
            {fetcher.data.error.code}
          </h1>
          <p>{fetcher.data.error.message}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
