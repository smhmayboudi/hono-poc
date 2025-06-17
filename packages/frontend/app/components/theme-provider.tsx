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
import { href } from "react-router";

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
  type: "THEME_THEME";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: FC<
  PropsWithChildren<{ serverThemePreference?: ThemePreference }>
> = ({ children, serverThemePreference = "system" }) => {
  const broadcastChannel = useBroadcastChannel();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    serverThemePreference === "dark" ? "dark" : "light",
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    serverThemePreference,
  );

  useEffect(() => {
    const fetchInitialTheme = async () => {
      const response = await fetch(
        href("/api/preferences/*", { "*": "theme" }),
      );
      const data: {
        theme: ThemePreference;
      } = await response.json();
      setThemePreference(data.theme || "system");
      setIsHydrated(true);
    };

    fetchInitialTheme();
  }, []);

  useEffect(() => {
    const cleanup = broadcastChannel.onMessage<ThemeMessage>((message) => {
      if (message.type === "THEME_THEME") {
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
          type: "THEME_THEME",
          theme: newValue,
        });
        fetch(href("/api/preferences/*", { "*": "theme" }), {
          body: JSON.stringify({ theme: newValue }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        return newValue;
      });
    },
    [broadcastChannel],
  );

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
  }, [currentTheme, isHydrated]);

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
      className={`fixed flex mt-10 p-4 top-0 z-10 ${i18n.dir() === "ltr" ? "right-0" : "left-0"}`}
    >
      <Button c_size="xs" onClick={cycleTheme}>
        {getThemeText()}
      </Button>
    </div>
  );
};
