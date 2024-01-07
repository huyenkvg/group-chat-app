import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { IChannel, IMember, IServer } from "@/typing/model-types";
import { InviteModal } from "@/components/modals/invite-code/imvite-code-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal/create-channel-modal";
import ChannelList from "@/components/sidebar-components/ChannelList";
import DMList from "@/components/sidebar-components/DMList";

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
  const isOwner = server?.profileId === profile.id;

  if (!server) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <div className="flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-around bg-gray-800  w-full">
            <h1 className="text-indigo-400 text-lg font-semibold px-4 py-2 uppercase">
              {server.name}
            </h1>
            </div>
          <ChannelList channels={server.channels} />{" "}
          <CreateChannelModal server={server} isOwner={isOwner} />
          <DMList members={server.members as IMember[]} />
          <div className="flex-shrink-0 flex bg-gray-600 p-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300 text-sm">
                Members: {server.members.length}
              </span>
              <InviteModal server={server} />
            </div>
          </div>
        </div>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
