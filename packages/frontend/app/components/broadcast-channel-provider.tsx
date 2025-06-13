import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { BroadcastChannelService } from "~/services/broadcast-channel.service";

interface BroadcastChannelContextType {
  broadcastChannelService: BroadcastChannelService;
}

interface BroadcastChannelProviderProps {
  channelName: string;
}

const BroadcastChannelContext =
  createContext<BroadcastChannelContextType | null>(null);

export const BroadcastChannelProvider: FC<
  PropsWithChildren<BroadcastChannelProviderProps>
> = ({ channelName, children }) => {
  const broadcastChannelService = useMemo(
    () => new BroadcastChannelService(channelName),
    [channelName],
  );

  useEffect(() => {
    return () => {
      broadcastChannelService.close();
    };
  }, [broadcastChannelService]);

  return (
    <BroadcastChannelContext.Provider value={{ broadcastChannelService }}>
      {children}
    </BroadcastChannelContext.Provider>
  );
};

export const useBroadcastChannel = (): BroadcastChannelService => {
  const context = useContext(BroadcastChannelContext);
  if (!context) {
    throw new Error(
      "useBroadcastChannel must be used within a BroadcastChannelProvider",
    );
  }

  return context.broadcastChannelService;
};
