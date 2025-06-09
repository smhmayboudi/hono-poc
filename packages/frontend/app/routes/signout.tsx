import type { FormEvent } from "react";
import { href, useFetcher, useNavigate } from "react-router";

import { AuthRequire, useAuth } from "~/components/auth-provider";
import Button from "~/components/ui/button";
import Loading from "~/components/ui/loading";

import type { Route } from "./+types/signout";

// export const meta = ({}: Route.MetaArgs) => [
//   { title: "Signout" },
//   { content: "Signout | description", name: "description" },
// ];

export default ({}: Route.ComponentProps) => {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    auth.signOut(() => {
      navigate(href("/"));
    });
  };

  return (
    <AuthRequire>
      <div>
        {auth.error ? (
          <div>
            <p>{String(auth.error)}</p>
          </div>
        ) : null}
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <fieldset className="bg-base-200 border border-base-300 fieldset p-4 rounded-box">
            <legend className="fieldset-legend">Signout</legend>
            <p>Are you sure you want to signout?</p>
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
    </AuthRequire>
  );
};
