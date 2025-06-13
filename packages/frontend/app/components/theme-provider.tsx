import {
  createContext,
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useBroadcastChannel } from "~/components/broadcast-channel-provider";
import Button from "~/components/ui/button";

type ThemePreference = "dark" | "light" | "system";

interface ThemeContextType {
  currentTheme: "dark" | "light";
  isHydrated: boolean;
  setThemePreference: Dispatch<SetStateAction<ThemePreference>>;
  themePreference: ThemePreference;
}

type ThemeMessage = {
  theme: ThemePreference;
  type: "THEME_UPDATE";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: FC<
  PropsWithChildren<{ serverThemePreference?: ThemePreference }>
> = ({ children, serverThemePreference = "system" }) => {
  const getCookie = useCallback((name: string): "dark" | "light" | null => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue as "dark" | "light";
      }
    }
    return null;
  }, []);

  const setCookie = useCallback(
    (name: string, value: "dark" | "light", days = 365) => {
      const expires = new Date(Date.now() + days * 86400e3).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; sameSite=lax`;
    },
    [],
  );

  const broadcastChannel = useBroadcastChannel();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    serverThemePreference === "dark" ? "dark" : "light",
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    serverThemePreference,
  );

  useEffect(() => {
    const cleanup = broadcastChannel.onMessage<ThemeMessage>((message) => {
      if (message.type === "THEME_UPDATE") {
        setThemePreference(message.theme);
      }
    });

    return () => {
      cleanup();
    };
  }, [broadcastChannel]);

  const handleSetThemePreference = useCallback<
    Dispatch<SetStateAction<ThemePreference>>
  >(
    (action) => {
      setThemePreference((prev) => {
        const newValue = typeof action === "function" ? action(prev) : action;
        broadcastChannel.postMessage<ThemeMessage>({
          type: "THEME_UPDATE",
          theme: newValue,
        });

        return newValue;
      });
    },
    [broadcastChannel],
  );

  useEffect(() => {
    setIsHydrated(true);
    const cookieValue = getCookie("__user_theme_preference");
    setThemePreference(cookieValue ?? "system");
  }, [getCookie]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (themePreference === "system") {
        setCurrentTheme(event.matches ? "dark" : "light");
      }
    };
    if (themePreference === "system") {
      setCurrentTheme(mediaQuery.matches ? "dark" : "light");
    } else {
      setCurrentTheme(themePreference);
    }
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [themePreference, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (themePreference !== "system") {
      setCookie("__user_theme_preference", themePreference);
    } else {
      document.cookie =
        "__user_theme_preference=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; sameSite=lax";
    }
  }, [currentTheme, themePreference, isHydrated, setCookie]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        isHydrated,
        setThemePreference: handleSetThemePreference,
        themePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }

  return context;
};

export const DarkModeStatus = () => {
  const { i18n } = useTranslation();
  const { currentTheme, isHydrated, setThemePreference, themePreference } =
    useDarkMode();

  const cycleTheme = useCallback(() => {
    setThemePreference((prev) => {
      switch (prev) {
        case "dark":
          return "light";
        case "light":
          return "system";
        default:
          return "dark";
      }
    });
  }, [setThemePreference]);

  const getThemeText = useCallback(() => {
    if (!isHydrated) {
      return "🌓 System";
    }
    if (themePreference === "system") {
      return `🌓 System (${currentTheme})`;
    }

    return themePreference === "dark" ? "🌙 Dark" : "☀️ Light";
  }, [currentTheme, themePreference, isHydrated]);

  return (
    <div
      className={`fixed flex mt-10 p-2 top-0 z-10 ${i18n.dir() === "ltr" ? "right-0" : "left-0"}`}
    >
      <Button c_size="xs" onClick={cycleTheme}>
        {getThemeText()}
      </Button>
    </div>
  );
};
