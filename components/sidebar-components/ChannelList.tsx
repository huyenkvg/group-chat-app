"use client";

import { useChannelSocket } from "@/hooks/use-channel-socket";
import { cn } from "@/lib/utils";
import { Channel } from "@prisma/client";
import { SendHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ChannelList = ({
  channels = [],
  mutateServerId,
}: {
  channels: Channel[];
  mutateServerId: () => void;
}) => {
  const pathname = usePathname();
  const restChannels = channels.filter((channel) => channel.name !== "general");
  const generalChannel = channels.find((channel) => channel.name === "general");

  const {
    channelsHasNewMessage,
    readMessages,
  } = useChannelSocket({
    channelIds: channels.map((channel) => channel.id),
    mutateServerId,
  });

  return (
    <nav className="px-2 py-4 bg-gray-800 space-y-1 max-h-72 overflow-y-auto">
      {generalChannel && (
        <Link
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
          {channelsHasNewMessage[generalChannel.id] > 0 &&
            !pathname?.endsWith(`/channels/${generalChannel.id}`) && (
              <span className="px-1 bg-red-500 rounded-full text-sm text-white">
                {channelsHasNewMessage[generalChannel.id]}
              </span>
            )}
        </Link>
      )}
      {restChannels.map((channel: Channel) => {
        const isCurrentPath = pathname?.endsWith(`/channels/${channel.id}`);
        const hasNewMessage = channelsHasNewMessage[channel.id] > 0;
        return (
          <Link
            key={channel.id}
            href={`/servers/${channel.serverId}/channels/${channel.id}`}
            className={cn(
              "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isCurrentPath && "bg-gray-700 font-semibold"
            )}
            onClick={() => readMessages(channel.id)}
          >
            <span className="truncate flex flex-grow gap-2">
              <span className="w-4 h-5 text-gray-300">#</span>
              {channel.name}
              {hasNewMessage && !isCurrentPath && (
                <span className="px-1 bg-red-500 rounded-full text-sm text-white">
                  {channelsHasNewMessage[channel.id]}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default ChannelList;
