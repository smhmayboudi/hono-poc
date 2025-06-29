import z from "zod";

import { authClient } from "~/auth-client.server";
import { csrf } from "~/csrf.server";
import { userSession } from "~/session.server";

import type { Route } from "./+types/api.auth.$";

const actionSignInEmail = async (request: Request) => {
  const session = await userSession.getSession(request.headers.get("cookie"));
  try {
    const formData = await request.formData();
    const signinSchema = z.object({
      email: z.string().email(),
      password: z.string(),
      rememberMe: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    });
    const signin = signinSchema.parse(Object.fromEntries(formData));
    const { data, error } = await authClient.signIn.email(signin);
    if (!data && !!error) {
      throw error;
    }
    session.set("token", data.token);
    session.set("user", data.user);

    return Response.json(
      {
        token: data.token,
        user: data.user,
      },
      {
        headers: {
          "Set-Cookie": await userSession.commitSession(session, {
            expires: signin.rememberMe
              ? new Date(Date.now() + 6.048e8)
              : undefined,
          }),
        },
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return Response.json(
      { error: String(error) },
      {
        headers: { "Set-Cookie": await userSession.destroySession(session) },
        status: 400,
      },
    );
  }
};

const actionSignOut = async (request: Request) => {
  const session = await userSession.getSession(request.headers.get("cookie"));
  try {
    const { data, error } = await authClient.signOut({
      fetchOptions: {
        credentials: "include",
        headers: { Authorization: `Bearer ${session.get("token") ?? ""}` },
      },
    });
    if (!data && !!error) {
      throw error;
    }

    return Response.json(
      {},
      {
        headers: { "Set-Cookie": await userSession.destroySession(session) },
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return Response.json(
      { error: String(error) },
      {
        headers: { "Set-Cookie": await userSession.destroySession(session) },
        status: 400,
      },
    );
  }
};

const actionSignUpEmail = async (request: Request) => {
  const session = await userSession.getSession(request.headers.get("cookie"));
  try {
    const formData = await request.formData();
    const signupSchema = z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string(),
    });
    const signup = signupSchema.parse(Object.fromEntries(formData));
    const { data, error } = await authClient.signUp.email(signup);
    if (!data && !!error) {
      throw error;
    }
    session.set("token", data.token ?? undefined);
    session.set("user", data.user);

    return Response.json(
      {
        token: data.token,
        user: data.user,
      },
      {
        headers: { "Set-Cookie": await userSession.commitSession(session) },
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return Response.json(
      { error: String(error) },
      {
        headers: { "Set-Cookie": await userSession.destroySession(session) },
        status: 400,
      },
    );
  }
};

const actionGetSession = async (request: Request) => {
  const session = await userSession.getSession(request.headers.get("cookie"));
  if (!session.has("token") || !session.has("user")) {
    return Response.json({});
  }
  try {
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        // credentials: "include",
        headers: { Authorization: `Bearer ${session.get("token") ?? ""}` },
      },
      query: { disableCookieCache: true, disableRefresh: true },
    });
    if (!data && !!error) {
      return Response.json(
        {},
        {
          headers: { "Set-Cookie": await userSession.destroySession(session) },
        },
      );
    }
    session.set("token", data.session.token);
    session.set("user", data.user);

    return Response.json(
      {
        token: data.session.token,
        user: data.user,
      },
      {
        headers: {
          "Set-Cookie": await userSession.commitSession(session, {
            expires: data.session.expiresAt,
          }),
        },
      },
    );
  } catch (error) {
    session.flash("error", String(error));

    return Response.json(
      { error: String(error) },
      {
        headers: { "Set-Cookie": await userSession.destroySession(session) },
        status: 400,
      },
    );
  }
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const actionType = params["*"];
  if (actionType === "signin" || actionType === "signup") {
    await csrf.validate(request);
  }
  switch (actionType) {
    case "signin":
      return actionSignInEmail(request);
    case "signup":
      return actionSignUpEmail(request);
    case "signout":
      return actionSignOut(request);
  }

  return Response.json(
    { error: "Not Found" },
    {
      headers: { "Content-Type": "application/json" },
      status: 404,
    },
  );
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const actionType = params["*"];
  if (actionType === "getsession") {
    return actionGetSession(request);
  }

  return Response.json(
    { error: "Not Found" },
    {
      headers: { "Content-Type": "application/json" },
      status: 404,
    },
  );
};
