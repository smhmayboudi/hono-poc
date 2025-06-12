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
import { href, Navigate, useLocation, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import type { SessionData } from "~/session.server";

type AuthApiResponse =
  | {
      error?: never;
      token: string;
      user: SessionData["user"];
    }
  | {
      error: string;
      token?: never;
      user?: never;
    };

type AuthProviderMessage = {
  type: "GET_SESSION";
};
type BroadcastMessage = AuthProviderMessage;

interface AuthContextType {
  error: Error | null;
  getSession: (abortController: AbortController) => Promise<void>;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe: boolean,
    callback?: VoidFunction,
  ) => Promise<void>;
  signOut: (callback?: VoidFunction) => Promise<void>;
  signUp: (
    email: string,
    name: string,
    password: string,
    callback?: VoidFunction,
  ) => Promise<void>;
  token: string | null;
  user: SessionData["user"] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<
  PropsWithChildren<{ serverSession?: SessionData | null }>
> = ({ children, serverSession }) => {
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
      updateState({ error: null, loading: true });
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
            loading: false,
            token: null,
            user: null,
          });
        }
        updateState({
          error: null,
          loading: false,
          token: data.token,
          user: data.user,
        });
      } catch (error) {
        updateState({
          error: error instanceof Error ? error : new Error("getSession Error"),
          loading: false,
        });
      }
    },
    [updateState],
  );

  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean,
    callback?: VoidFunction,
  ) => {
    updateState({ error: null, loading: true });
    try {
      const formData = new URLSearchParams();
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
          loading: false,
          token: data.token,
          user: data.user,
        });
        broadcastChannel?.postMessage({
          type: "GET_SESSION",
        } as AuthProviderMessage);
        callback?.();
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signIn Error"),
        loading: false,
      });
    }
  };

  const signOut = async (callback?: VoidFunction) => {
    updateState({ error: null, loading: true });
    try {
      const data = await fetchAuth(href("/api/auth/*", { "*": "signout" }));
      if (data.error) {
        throw new Error(data.error);
      }
      updateState({
        error: null,
        loading: false,
        token: null,
        user: null,
      });
      broadcastChannel?.postMessage({
        type: "GET_SESSION",
      } as AuthProviderMessage);
      callback?.();
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signOut Error"),
        loading: false,
      });
    }
  };

  const signUp = async (
    email: string,
    name: string,
    password: string,
    callback?: VoidFunction,
  ) => {
    updateState({ error: null, loading: true });
    try {
      const formData = new URLSearchParams();
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
          loading: false,
          token: data.token,
          user: data.user,
        });
        broadcastChannel?.postMessage({
          type: "GET_SESSION",
        } as AuthProviderMessage);
        callback?.();
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signUp Error"),
        loading: false,
      });
    }
  };

  const [broadcastChannel, setBroadcastChannel] =
    useState<BroadcastChannel | null>(null);
  const [state, setState] = useState<{
    error: Error | null;
    loading: boolean;
    token: string | null;
    user: SessionData["user"] | null;
  }>({
    error: null,
    loading: !serverSession,
    token: serverSession?.token || null,
    user: serverSession?.user || null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    if (!serverSession) {
      getSession(abortController);
    }

    return () => {
      abortController.abort();
    };
  }, [serverSession, getSession]);

  useEffect(() => {
    const abortController = new AbortController();
    const channel = new BroadcastChannel("auth_provider");
    const listener = (event: MessageEvent<BroadcastMessage>) => {
      const isAuthProviderMessage = (
        message: unknown,
      ): message is AuthProviderMessage =>
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === "GET_SESSION";
      if (isAuthProviderMessage(event.data)) {
        getSession(abortController);
      }
    };
    channel.addEventListener("message", listener);
    setBroadcastChannel(channel);

    return () => {
      abortController.abort();
      channel.removeEventListener("message", listener);
      channel.close();
    };
  }, [getSession]);

  return (
    <AuthContext.Provider
      value={{ ...state, getSession, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthStatus = () => {
  const { i18n } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed flex mt-20 p-2 top-0 z-10 ${i18n.dir() === "ltr" ? "right-0" : "left-0"}`}
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

  return auth.token && auth.user ? (
    children
  ) : (
    <Navigate to={href("/signin")} replace state={{ from: location }} />
  );
};
