import {
  createContext,
  type FC,
  type JSX,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { href, useLocation, useNavigate } from "react-router";

import { useBroadcastChannel } from "~/components/broadcast-channel-provider";
import Button from "~/components/ui/button";
import Loading from "~/components/ui/loading";
import { Navigate } from "~/components/ui/navigate";
import type { SessionData } from "~/session.server";

type AuthApiResponse =
  | {
      error?: never;
      token: SessionData["token"];
      user: SessionData["user"];
    }
  | {
      error: string;
      token?: never;
      user?: never;
    };

type AuthProviderMessage = {
  type: "AUTH_GET_SESSION";
};

interface AuthContextType {
  error: Error | null;
  getSession: (abortController: AbortController) => Promise<void>;
  isLoading: boolean;
  signIn: (
    csrf: string,
    email: string,
    password: string,
    rememberMe: boolean,
    callback?: VoidFunction,
  ) => Promise<void>;
  signOut: (callback?: VoidFunction) => Promise<void>;
  signUp: (
    csrf: string,
    email: string,
    name: string,
    password: string,
    callback?: VoidFunction,
  ) => Promise<void>;
  token: SessionData["token"] | null;
  user: SessionData["user"] | null;
}

const authContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<
  PropsWithChildren<{ session: SessionData | null }>
> = ({ children, session }) => {
  const updateState = useCallback(
    (updates: Partial<typeof state>) =>
      setState((prev) => ({ ...prev, ...updates })),
    [],
  );

  const fetchAuth = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        ...options,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return (await response.json()) as AuthApiResponse;
    } catch (error) {
      throw error instanceof Error ? error : new Error("fetchAuth Error");
    }
  };

  const getSession = useCallback(
    async (abortController: AbortController) => {
      updateState({ error: null, isLoading: true });
      try {
        const data = await fetchAuth(
          href("/api/auth/*", { "*": "getsession" }),
          {
            method: "GET",
            signal: abortController.signal,
          },
        );
        if (data.error) {
          updateState({
            error: null,
            isLoading: false,
            token: null,
            user: null,
          });
        }
        updateState({
          error: null,
          isLoading: false,
          token: data.token,
          user: data.user,
        });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error : new Error("getSession Error"),
          isLoading: false,
          token: null,
          user: null,
        });
      }
    },
    [updateState],
  );

  const signIn = async (
    csrf: string,
    email: string,
    password: string,
    rememberMe: boolean,
    callback?: VoidFunction,
  ) => {
    updateState({ error: null, isLoading: true });
    try {
      const formData = new URLSearchParams();
      formData.append("csrf", csrf);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("rememberMe", rememberMe.toString());
      const data = await fetchAuth(href("/api/auth/*", { "*": "signin" }), {
        body: formData,
      });
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.token && data.user) {
        updateState({
          error: null,
          isLoading: false,
          token: data.token,
          user: data.user,
        });
        broadcastChannel.postMessage<AuthProviderMessage>({
          type: "AUTH_GET_SESSION",
        });
        callback?.();
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signIn Error"),
        isLoading: false,
        token: null,
        user: null,
      });
    }
  };

  const signOut = async (callback?: VoidFunction) => {
    updateState({ error: null, isLoading: true });
    try {
      const data = await fetchAuth(href("/api/auth/*", { "*": "signout" }));
      if (data.error) {
        throw new Error(data.error);
      }
      updateState({
        error: null,
        isLoading: false,
        token: null,
        user: null,
      });
      broadcastChannel.postMessage<AuthProviderMessage>({
        type: "AUTH_GET_SESSION",
      });
      callback?.();
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signOut Error"),
        isLoading: false,
        token: null,
        user: null,
      });
    }
  };

  const signUp = async (
    csrf: string,
    email: string,
    name: string,
    password: string,
    callback?: VoidFunction,
  ) => {
    updateState({ error: null, isLoading: true });
    try {
      const formData = new URLSearchParams();
      formData.append("csrf", csrf);
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);
      const data = await fetchAuth(href("/api/auth/*", { "*": "signup" }), {
        body: formData,
      });
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.token && data.user) {
        updateState({
          error: null,
          isLoading: false,
          token: data.token,
          user: data.user,
        });
        broadcastChannel.postMessage<AuthProviderMessage>({
          type: "AUTH_GET_SESSION",
        });
        callback?.();
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signUp Error"),
        isLoading: false,
        token: null,
        user: null,
      });
    }
  };

  const broadcastChannel = useBroadcastChannel();
  const [state, setState] = useState<{
    error: Error | null;
    isLoading: boolean;
    token: SessionData["token"] | null;
    user: SessionData["user"] | null;
  }>({
    error: null,
    isLoading: !session,
    token: session?.token || null,
    user: session?.user || null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    if (!session?.token || !session?.user) {
      getSession(abortController);
    }

    return () => {
      abortController.abort();
    };
  }, [session, getSession]);

  useEffect(() => {
    const abortController = new AbortController();
    const cleanup = broadcastChannel.onMessage<AuthProviderMessage>(
      (message) => {
        if (message.type === "AUTH_GET_SESSION") {
          getSession(abortController);
        }
      },
    );

    return () => {
      abortController.abort();
      cleanup();
    };
  }, [broadcastChannel, getSession]);

  return (
    <authContext.Provider
      value={{ ...state, getSession, signIn, signOut, signUp }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthStatus = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return auth.isLoading ? (
    <Loading c_size="xs" />
  ) : (
    <div
      className={`fixed flex mt-20 p-4 top-0 z-10 ${i18n.dir() === "ltr" ? "right-0" : "left-0"}`}
    >
      <p className="dark:text-white">
        {auth.token && auth.user ? (
          <>
            <span className="flex gap-2">{auth.user.name}</span>
            <Button
              aria-label="Sign out"
              c_size="xs"
              onClick={() => {
                auth.signOut(() => {
                  navigate(href("/"));
                });
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              aria-label="Sign in"
              c_size="xs"
              onClick={() => {
                navigate(href("/signin"));
              }}
            >
              Sign in
            </Button>
          </>
        )}
      </p>
    </div>
  );
};

export const AuthNotRequire = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.token && auth.user ? (
    <Navigate to={location.state?.from?.pathname || "/"} replace />
  ) : (
    children
  );
};

export const AuthRequire = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    const abortController = new AbortController();
    if (!auth.token || !auth.user) {
      auth.getSession(abortController);
    }

    return () => {
      abortController.abort();
    };
  }, [auth]);

  return auth.token && auth.user ? (
    children
  ) : (
    <Navigate to={href("/signin")} replace state={{ from: location }} />
  );
};
