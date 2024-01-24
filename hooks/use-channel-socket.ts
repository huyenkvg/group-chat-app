"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Channel } from "@prisma/client";

import { useSocket } from "@/components/providers/socket-provider";
import { usePathname } from "next/navigation";

type ChannelSocketProps = {
  channelIds: string[];
};

type ChannelId = {
  id: string;
};

export const useChannelSocket = ({ channelIds }: ChannelSocketProps) => {
  const { socket } = useSocket();
  const pathname = usePathname();
  const [channelsHasNewMessage, setChannelsHasNewMessage] = useState<
    Record<ChannelId["id"], number>
  >({});
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("notification", (id: Channel["id"]) => {
      setChannelsHasNewMessage((prev) => {
        if (pathname?.endsWith(id)) {
          return prev;
        }
        if (!prev[id] || typeof prev[id] !== "number")
          return {
            ...prev,
            [id]: 1,
          };
        prev[id] += 1;
        return prev;
      });
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, channelIds]);

  const readMessages = useCallback((id: Channel["id"]) => {
    setChannelsHasNewMessage((prev) =>{
      delete prev[id];
      return {...prev};
    });
  }, []);

  return {
    channelsHasNewMessage,
    readMessages,
  };
};
