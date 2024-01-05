import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChevronDown, Component, SendHorizontal } from "lucide-react";
import { IChannel, IMember, IServer } from "@/typing/model-types";
import { InviteModal } from "@/components/modals/invite-code/imvite-code-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateChannelModal } from "@/components/modals/create-channel-modal/create-channel-modal";

const DMList = ({ members = [] }: { members: IMember[] }) => {
  return (
    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
      <a
        href="#"
        className=" text-white group flex items-center px-2 py-2 mb-2 tracking-wider text-base font-medium rounded-md gap-x-2 justify-between"
      >
        direct messages
        <ChevronDown className="w-4 h-5 text-gray-200" />
      </a>
      {members.map((member: IMember) => {
        return (
          <a
            key={member.id}
            href={`/servers/${member.serverId}/members/${member.id}`}
            className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          >
            <span className="truncate flex flex-grow gap-2 items-center">
              <Avatar>
                <AvatarImage src={member.profile.imageUrl} />
                <AvatarFallback>{member.profile.name}</AvatarFallback>
              </Avatar>
              {member.profile.name}
            </span>
          </a>
        );
      })}
    </nav>
  );
};
const ChannelList = ({ channels = [] }: { channels: IChannel[] }) => {
  return (
    <nav className="px-2 py-4 bg-gray-800 space-y-1">
      <a
        href="#"
        className=" text-white group flex items-center px-2 py-2 mb-2 tracking-wider text-base font-medium rounded-md gap-x-2 justify-between"
      >
        channels
        <ChevronDown className="w-4 h-5 text-gray-200" />
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
    // TODO: bring localhost 3000 to ENV named NEXT_PUBLIC_URL
    return redirectToSignIn({
      returnBackUrl: `http://localhost:3000/servers/${params.serverId}`,
    });
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
      members: {
        include: {
          profile: true,
        },
      },
    },
  });
  const channel = await db.channel.findMany({
    where: {
      serverId: params.serverId,
    },
  });

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <ChannelList channels={server.channels as IChannel[]} />{" "}
          <CreateChannelModal server={server} />
          <DMList members={server.members as IMember[]} />
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
