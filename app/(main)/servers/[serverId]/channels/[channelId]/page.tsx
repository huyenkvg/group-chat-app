import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { SocketIndicator } from "@/components/providers/socket-indicator";
import { MessageInput } from "@/components/chat-components/message-input";
import { ChatList } from "@/components/chat-components/chat-list";
import { Channel } from "@prisma/client";

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

const ChannelHeader = ({ channel }: { channel: Channel }) => {
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
    <div className="bg-opacity-40 bg-slate-200   dark:bg-[#313338]  flex flex-col h-full relative">
      <ChannelHeader channel={channel} />
      <section className="flex-1 overflow-y-scroll">
        <ChatList
          member={member}
          name={channel.name}
          chatId={channel.id}
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
          isDirectMessage={false}
        />
      </section>
      <div className="w-full pt-[7.5rem] bg-transparent"/>
      <div className="h-fit absolute bottom-0 right-0 left-0 flex-1">
        <MessageInput
          name={channel.name}
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
