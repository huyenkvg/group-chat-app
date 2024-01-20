"use client";

import { cn } from "@/lib/utils";
import { Channel } from "@prisma/client";
import { ChevronDown, SendHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const ChannelList = ({ channels = [] }: { channels: Channel[] }) => {
  const pathname = usePathname();
  const restChannels = channels.filter((channel) => channel.name !== "general");
  const generalChannel = channels.find((channel) => channel.name === "general");
  return (
    <nav className="px-2 py-4 bg-gray-800 space-y-1 max-h-72 overflow-y-auto">
      {generalChannel && (
        <a
          href={`/servers/${generalChannel.serverId}/channels/${generalChannel.id}`}
          className={cn(
            "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md",
            pathname?.endsWith(`/channels/${generalChannel.id}`) &&
              "bg-gray-700 font-semibold"
          )}
        >
          <span className="truncate flex flex-grow gap-2">
            <SendHorizontal className="w-4 h-5 text-gray-300" />
            {generalChannel.name}
          </span>
        </a>
      )}
      {restChannels.map((channel: Channel) => {
        const isCurrentPath = pathname?.endsWith(`/channels/${channel.id}`);
        return (
          <a
            key={channel.id}
            href={`/servers/${channel.serverId}/channels/${channel.id}`}
            className={cn(
              "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isCurrentPath && "bg-gray-700 font-semibold"
            )}
          >
            <span className="truncate flex flex-grow gap-2">
              <span className="w-4 h-5 text-gray-300">#</span>
              {channel.name}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

export default ChannelList;
