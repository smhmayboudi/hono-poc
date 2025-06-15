import { type FormEvent, useState } from "react";
import { href, useFetcher, useNavigate } from "react-router";
import { z } from "zod";

import { AuthNotRequire, useAuth } from "~/components/auth-provider";
import { CSRFInput } from "~/components/csrf-provider";
import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import Loading from "~/components/ui/loading";

import type { Route } from "./+types/signup";

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Signup" },
//   { content: "Signup | description", name: "description" },
// ];

export default ({}: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const auth = useAuth();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const signupSchema = z.object({
      csrf: z.string(),
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    });
    const signup = signupSchema.parse(Object.fromEntries(formData));
    auth.signUp(signup.csrf, signup.email, signup.name, signup.password, () => {
      navigate(href("/"));
    });
  };

  return (
    <AuthNotRequire>
      <div>
        {auth.error ? (
          <div>
            <p>{String(auth.error)}</p>
          </div>
        ) : null}
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <CSRFInput name="csrf" />
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
    </AuthNotRequire>
  );
};
