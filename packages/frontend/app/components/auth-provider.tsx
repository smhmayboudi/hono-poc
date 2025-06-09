import {
  createContext,
  type JSX,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { href, Navigate, useLocation, useNavigate } from "react-router";

import Button from "~/components/ui/button";
import type { SessionData } from "~/sessions.server";
import { authClient } from "~/utils/auth-client";

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
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };
  useEffect(() => {
    if (!serverSession) {
      getSession();
    }
  }, []);
  const getSession = async () => {
    updateState({ loading: true, error: null });
    try {
      const { data, error } = await authClient.getSession({
        fetchOptions: { credentials: "include" },
      });
      if (error) {
        throw error;
      }
      updateState({
        loading: false,
        token: data?.session.token || null,
        user: data?.user || null,
      });
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("getSession Error"),
        loading: false,
      });
    }
  };
  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean,
    callback?: VoidFunction,
  ) => {
    updateState({ loading: true, error: null });
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });
      if (error) {
        throw error;
      }
      updateState({
        loading: false,
        token: data.token,
        user: data.user,
      });
      if (!error) {
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
    updateState({ loading: true });
    try {
      const { error } = await authClient.signOut({
        fetchOptions: { credentials: "include" },
      });
      if (error) {
        throw error;
      }
      updateState({
        loading: false,
        token: null,
        user: null,
      });
      if (!error) {
        callback?.();
      }
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
    updateState({ loading: true });
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        name,
        password,
      });
      if (error) {
        throw error;
      }
      updateState({
        loading: false,
        token: data.token,
        user: data.user,
      });
      if (!error) {
        callback?.();
      }
    } catch (error) {
      updateState({
        error: error instanceof Error ? error : new Error("signUp Error"),
        loading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, getSession, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

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
            Welcome {auth.user.name}!&nbsp;
            <Button
              c_size="xs"
              className="btn"
              onClick={() => {
                navigate(href("/signout"));
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>You are not logged in.</>
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
