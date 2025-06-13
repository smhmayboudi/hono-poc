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

type BannerVisibilityMessage = {
  type: "VISIBILITY_UPDATE";
  visible: boolean;
};

export const BannerVisibilityContext = createContext<{
  isVisible: boolean;
  updateVisibility: (visible: boolean) => void;
}>({
  isVisible: true,
  updateVisibility: () => {},
});

export const BannerVisibilityProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const broadcastChannel = useBroadcastChannel();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchInitialVisibility = async () => {
      const response = await fetch(href("/api/preferences"));
      const data: {
        showBanner: boolean;
      } = await response.json();
      setIsVisible(data.showBanner);
    };

    fetchInitialVisibility();
  }, []);

  useEffect(() => {
    const cleanup = broadcastChannel.onMessage<BannerVisibilityMessage>(
      (message) => {
        if (message.type === "VISIBILITY_UPDATE") {
          setIsVisible(message.visible);
        }
      },
    );

    return () => {
      cleanup();
    };
  }, [broadcastChannel]);

  const updateVisibility = async (visible: boolean) => {
    setIsVisible(visible);
    broadcastChannel.postMessage<BannerVisibilityMessage>({
      type: "VISIBILITY_UPDATE",
      visible,
    });
    await fetch(href("/api/preferences"), {
      body: JSON.stringify({ showBanner: visible }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  };

  return (
    <BannerVisibilityContext.Provider
      value={{
        isVisible,
        updateVisibility,
      }}
    >
      {children}
    </BannerVisibilityContext.Provider>
  );
};

export const useBannerVisibility = () => {
  return useContext(BannerVisibilityContext);
};
