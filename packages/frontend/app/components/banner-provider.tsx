import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { href } from "react-router";

import { useBroadcastChannel } from "~/components/broadcast-channel-provider";
import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";

interface BannerContextType {
  isVisible: boolean;
  update: (visible: boolean) => void;
}

type BannerMessage = {
  type: "BANNER_VISIBLE";
  visible: boolean;
};

export const bannerContext = createContext<BannerContextType | null>(null);

export const BannerProvider: FC<PropsWithChildren> = ({ children }) => {
  const broadcastChannel = useBroadcastChannel();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchInitial = async () => {
      const response = await fetch(
        href("/api/preferences/*", { "*": "banner" }),
      );
      const data: {
        visible: boolean;
      } = await response.json();
      setIsVisible(data.visible);
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    const cleanup = broadcastChannel.onMessage<BannerMessage>((message) => {
      if (message.type === "BANNER_VISIBLE") {
        setIsVisible(message.visible);
      }
    });

    return () => {
      cleanup();
    };
  }, [broadcastChannel]);

  const update = async (visible: boolean) => {
    setIsVisible(visible);
    broadcastChannel.postMessage<BannerMessage>({
      type: "BANNER_VISIBLE",
      visible,
    });
    await fetch(href("/api/preferences/*", { "*": "banner" }), {
      body: JSON.stringify({ visible }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  };

  return (
    <bannerContext.Provider
      value={{
        isVisible,
        update,
      }}
    >
      {children}
    </bannerContext.Provider>
  );
};

export const useBanner = () => {
  const context = useContext(bannerContext);
  if (!context) {
    throw new Error("useBanner must be used within an BannerProvider");
  }

  return context;
};

export const BannerStatus = () => {
  const { isVisible, update } = useBanner();

  return isVisible ? (
    <div role="alert" className="alert alert-info">
      <Icon c_name="outline-info" />
      <span>Don't miss our banner!</span>
      <Button c_size="xs" onClick={() => update(false)}>
        Hide
      </Button>
    </div>
  ) : (
    <></>
  );
};
