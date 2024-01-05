import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { Component, SendHorizontal } from "lucide-react";
import { IChannel, IServer } from "@/typing/model-types";
import { InviteModal } from "@/components/modals/invite-code/imvite-code-modal";

const ChannelList = ({ channels = [] }: { channels: IChannel[] }) => {
  return (
    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
      <a
        href="#"
        className="bg-gray-900 text-white group flex items-center px-2 py-2 mb-2 tracking-widest text-base font-medium rounded-md gap-x-2"
      >
        <Component className="w-4 h-5 text-gray-200" />
        channels
      </a>
      {channels.map((channel: IChannel) => {
        const isDefaultChannel = channel.name === "general";
        return (
          <a
            key={channel.id}
            href={`/servers/${channel.serverId}/channels/${channel.id}`}
            className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          >
            <span className="truncate flex flex-grow gap-2">
              {isDefaultChannel ? (
                <SendHorizontal className="w-4 h-5 text-gray-300" />
              ) : (
                <span className="w-4 h-5 text-gray-300">#</span>
              )}
              {channel.name}
            </span>
          </a>
        );
      })}
    </nav>
  );
};

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: true,
      members: true,
    },
  });

  if (!server) {
    return redirect("/");
  }
  console.log("server", server);

  return (
    <div className="h-full">
      <div className="flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col">
            <ChannelList channels={server.channels as IChannel[]} />
          </div>
          {/* member list avatar ... */}
          <div className="flex-shrink-0 flex bg-gray-700 p-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300 text-sm">
                Members: {server.members.length}
              </span>
              <InviteModal server={server as IServer} />
            </div>
          </div>
        </div>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
