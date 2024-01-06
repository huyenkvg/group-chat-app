import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { IChannel } from "@/typing/model-types";
import { SocketIndicator } from "@/components/providers/socket-indicator";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const getChannel = async (channelId: string) => {
  return db.channel.findUnique({
    where: {
      id: channelId,
    },
  });
};

const getMember = async (serverId: string, profileId: string) => {
  return db.member.findFirst({
    where: {
      serverId,
      profileId,
    },
    include: {
      server: true,
    },
  });
};

const ChannelHeader = ({ channel }: { channel: IChannel }) => {
  if (!channel) {
    return null;
  }
  return (
    <div className="bg-gray-800  text-white py-4 px-6 flex flex-row items-center justify-between">
      <h1 className="text-xl font-bold"># {channel.name}</h1>
      <SocketIndicator />
    </div>
  );
};

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await getChannel(params.channelId);
  const member = await getMember(params.serverId, profile.id);

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-opacity-40 bg-slate-200   dark:bg-[#313338]  flex flex-col h-full">
      <ChannelHeader channel={channel as IChannel} />
      {/* TODO: create channel UI */}
    </div>
  );
};

export default ChannelIdPage;
