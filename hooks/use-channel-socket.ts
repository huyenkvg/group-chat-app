"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Channel, Server } from "@prisma/client";

import { useSocket } from "@/components/providers/socket-provider";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type ChannelSocketProps = {
  channelIds?: string[];
  mutateServerId: () => void;
};

type ChannelId = {
  id: string;
};

export const useChannelSocket = ({
  channelIds = [],
  mutateServerId,
}: ChannelSocketProps) => {
  const { socket } = useSocket();
  const pathname = usePathname();
  const { toast } = useToast();
  const [channelsHasNewMessage, setChannelsHasNewMessage] = useState<
    Record<ChannelId["id"], number>
  >({});

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("notification", (id: Channel["id"]) => {
      if (!channelIds?.includes(id)) {
        return;
      }
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

    socket.on("should-update-server-contents", (id: Server["id"]) => {
      const isCurrentServer = pathname?.includes(`/servers/${id}`);
      if (isCurrentServer) {
        mutateServerId();
        toast({
          title: "A channel has been created",
        });
      }
    });
    return () => {
      socket.off("notification");
      socket.off("should-update-server-contents");
    };
  }, [socket, channelIds, pathname, mutateServerId, toast]);

  const readMessages = useCallback((id: Channel["id"]) => {
    setChannelsHasNewMessage((prev) => {
      delete prev[id];
      return { ...prev };
    });
  }, []);

  const newChannelHasBeenCreated = useCallback(
    (id: Server["id"]) => {
      socket?.emit("server-has-changed", id);
    },
    [socket]
  );

  return {
    channelsHasNewMessage,
    readMessages,
    newChannelHasBeenCreated,
  };
};
