import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { Component, SendHorizontal } from "lucide-react";
import { IChannel, IServer } from "@/typing/model-types";

const ChannelList = ({ server }: { server: IServer }) => {
  if (!server?.channels) {
    return null;
  }
  return (
    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
      <a
        href="#"
        className="bg-gray-900 text-white group flex items-center px-2 py-2 mb-2 text-base font-medium rounded-md gap-x-2"
      >
        <Component className="w-4 h-5 text-gray-200" />
        Channels
      </a>
      {server.channels.map((channel: IChannel) => {
        const isDefaultChannel = channel.name === "general";
        return (
          <a
            key={channel.id}
            href={`/servers/${server.id}/channels/${channel.id}`}
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
      channels: {
        where: {
          serverId: params.serverId,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
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
            <ChannelList server={server} />
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <a href="#" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={profile.imageUrl}
                    alt="Profile image"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {profile.name}
                  </p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    View profile
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
