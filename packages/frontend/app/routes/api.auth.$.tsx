import z from "zod";

import { authClient } from "~/auth-client.server";
import { commitSession, destroySession, getSession } from "~/sessions.server";

import type { Route } from "./+types/api.auth.$";

export const actionSignInEmail = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const formData = await request.formData();
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string(),
      rememberMe: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    });
    const user = userSchema.parse(Object.fromEntries(formData));
    const { data, error } = await authClient.signIn.email(user);
    if (!data && error) {
      throw error;
    }
    session.set("token", data.token);
    session.set("user", data.user);

    return new Response(
      JSON.stringify({
        token: data.token,
        user: data.user,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await commitSession(session, {
            expires: user.rememberMe
              ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
              : undefined,
          }),
        },
        status: 200,
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return new Response(JSON.stringify({ error: String(error) }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session),
      },
      status: 400,
    });
  }
};

export const actionSignOut = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const { data, error } = await authClient.signOut({
      fetchOptions: {
        credentials: "include",
        headers: { Authorization: `Bearer ${session.get("token") ?? ""}` },
      },
    });
    if (!data && error) {
      throw error;
    }

    return new Response(JSON.stringify({}), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await destroySession(session),
      },
      status: 200,
    });
  } catch (error) {
    session.flash("error", String(error));

    return new Response(JSON.stringify({ error: String(error) }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session),
      },
      status: 400,
    });
  }
};

export const actionSignUpEmail = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const formData = await request.formData();
    const userSchema = z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string(),
    });
    const user = userSchema.parse(Object.fromEntries(formData));
    const { data, error } = await authClient.signUp.email(user);
    if (!data && error) {
      throw error;
    }
    session.set("token", data.token ?? undefined);
    session.set("user", data.user);

    return new Response(
      JSON.stringify({
        token: data.token,
        user: data.user,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await commitSession(session),
        },
        status: 200,
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return new Response(JSON.stringify({ error: String(error) }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session),
      },
      status: 400,
    });
  }
};

export const actionGetSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        credentials: "include",
        headers: { Authorization: `Bearer ${session.get("token") ?? ""}` },
      },
      query: { disableCookieCache: true },
    });
    if (!data && error) {
      throw error;
    }
    session.set("token", data.session.token);
    session.set("user", data.user);

    return new Response(
      JSON.stringify({
        token: data.session.token,
        user: data.user,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await commitSession(session, {
            expires: data.session.expiresAt,
          }),
        },
        status: 200,
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return new Response(JSON.stringify({ error: String(error) }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await commitSession(session),
      },
      status: 400,
    });
  }
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const actionType = params["*"];
  switch (actionType) {
    case "signin":
      return actionSignInEmail(request);
    case "signup":
      return actionSignUpEmail(request);
    case "signout":
      return actionSignOut(request);
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    headers: { "Content-Type": "application/json" },
    status: 404,
  });
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const actionType = url.pathname.split("/").pop();
  if (actionType === "getsession") {
    return actionGetSession(request);
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    headers: { "Content-Type": "application/json" },
    status: 404,
  });
};
