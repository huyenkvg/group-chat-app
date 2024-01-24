"use client";

import { useCallback, useEffect, useState } from "react";
import { Conversation } from "@prisma/client";

import { useSocket } from "@/components/providers/socket-provider";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type DirectMessageSocketProps = {
  memberIds?: string[];
  mutateServerId: () => void;
  myId: string;
};

export const useDirectMessageSocket = ({
  memberIds = [],
  mutateServerId,
  myId,
}: DirectMessageSocketProps) => {
  const { socket } = useSocket();
  const pathname = usePathname();
  const { toast } = useToast();
  const [newMessageFrom, setNewMessageFrom] = useState<
    Record<string,number>
  >({});

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("notification:direct-message", (msg: string) => {
      const [from, to] = msg.split(":");
      console.log('from',from)
      console.log('to',to)
      console.log('myId',myId)
      if (to !== myId || from === myId) {
        return;
      }
      setNewMessageFrom((prev) => {
        if (pathname?.endsWith(to)) {
          return prev;
        }
        if (!prev[from] || typeof prev[from] !== "number")
          return {
            ...prev,
            [from]: 1,
          };
        prev[from] += 1;
        return prev;
      });
    });

    return () => {
      socket.off("notification:direct-message");
    };
  }, [socket,memberIds, pathname, mutateServerId, toast]);

  const readMessages = useCallback((id: Conversation["id"]) => {
    setNewMessageFrom((prev) => {
      delete prev[id];
      return { ...prev };
    });
  }, []);

  return {
    newMessageFrom,
    readMessages,
  };
};
