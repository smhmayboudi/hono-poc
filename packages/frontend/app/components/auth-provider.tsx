import {
  createContext,
  type JSX,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { href, Navigate, useLocation, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import type { SessionData } from "~/sessions.server";

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

interface AuthContextType {
  error: Error | null;
  getSession: () => Promise<void>;
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

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({
  children,
  serverSession,
}: {
  children: ReactNode;
  serverSession?: SessionData | null;
}) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as AuthApiResponse;
    } catch (error) {
      throw error instanceof Error ? error : new Error("fetchAuth Error");
    }
  };

  const getSession = useCallback(async () => {
    updateState({ loading: true, error: null });
    try {
      const data = await fetchAuth("/api/auth/getsession", { method: "GET" });
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.token && data.user) {
        updateState({
          loading: false,
          token: data.token,
          user: data.user,
        });
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("getSession Error"),
        loading: false,
      });
    }
  }, [updateState]);

  const signIn = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean,
      callback?: VoidFunction,
    ) => {
      updateState({ loading: true, error: null });
      try {
        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("rememberMe", rememberMe.toString());
        const data = await fetchAuth("/api/auth/signin", { body: formData });
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.token && data.user) {
          updateState({
            loading: false,
            token: data.token,
            user: data.user,
          });
          callback?.();
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error : new Error("signIn Error"),
          loading: false,
        });
      }
    },
    [updateState],
  );

  const signOut = useCallback(
    async (callback?: VoidFunction) => {
      updateState({ loading: true });
      try {
        const data = await fetchAuth("/api/auth/signout");
        if (data.error) {
          throw new Error(data.error);
        }
        updateState({
          loading: false,
          token: null,
          user: null,
        });
        callback?.();
      } catch (error) {
        updateState({
          error: error instanceof Error ? error : new Error("signOut Error"),
          loading: false,
        });
      }
    },
    [updateState],
  );

  const signUp = useCallback(
    async (
      email: string,
      name: string,
      password: string,
      callback?: VoidFunction,
    ) => {
      updateState({ loading: true });
      try {
        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);
        const data = await fetchAuth("/api/auth/signup", { body: formData });
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.token && data.user) {
          updateState({
            loading: false,
            token: data.token,
            user: data.user,
          });
          callback?.();
        }
      } catch (error) {
        updateState({
          error: error instanceof Error ? error : new Error("signUp Error"),
          loading: false,
        });
      }
    },
    [updateState],
  );

  useEffect(() => {
    if (!serverSession) {
      getSession();
    }
  }, [getSession, serverSession]);

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
      className={`fixed flex mt-10 p-2 top-0 z-10 ${i18n.dir() === "ltr" ? "right-0" : "left-0"}`}
    >
      <p className="dark:text-white">
        {auth.token && auth.user ? (
          <>
            <span className="flex gap-2">{auth.user.name}</span>
            <Button
              c_size="xs"
              className="btn"
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
              c_size="xs"
              className="btn"
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

export const AuthRequire = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.token && auth.user ? (
    children
  ) : (
    <Navigate to={href("/signin")} replace state={{ from: location }} />
  );
};
