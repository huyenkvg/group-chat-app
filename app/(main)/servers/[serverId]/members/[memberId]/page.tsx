import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";

import { MediaRoom } from "@/components/media-room";
import { ChatList } from "@/components/chat-components/chat-list";
import { MessageInput } from "@/components/chat-components/message-input";
import { SocketIndicator } from "@/components/providers/socket-indicator";
import { Profile } from "@prisma/client";
import { VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
const ChannelHeader = ({
  name,
  imageUrl,
  serverId,
  memberId,
}: Profile & MemberIdPageProps["params"]) => {
  return (
    <div className="bg-gray-800  text-white py-4 px-6 flex flex-row items-center justify-between">
      <div className="flex items-center">
        <img className="w-10 h-10 rounded-full" src={imageUrl} alt={name} />
        <h1 className="text-xl font-bold ml-2">{name}</h1>
      </div>
      <div className="flex items-center">
        <Link
          href={`/servers/${serverId}/members/${memberId}?video=true`}
          className="relative h-8 w-8 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full  flex items-center justify-center"
        >
          <VideoIcon className="w-6 h-6 text-white mr-2 absolute top-1 left-1" />
        </Link>
        <SocketIndicator />
      </div>
    </div>
  );
};

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-opacity-40 bg-slate-200   dark:bg-[#313338]  flex flex-col h-full relative">
      <ChannelHeader
        {...params}
        {...otherMember.profile}
      />
      {searchParams.video ? (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      ) : (
        <>
          <section className="flex-1 overflow-y-scroll">
            <ChatList
              member={currentMember}
              name={otherMember.profile.name}
              chatId={conversation.id}
              socketQuery={{
                channelId: conversation.id,
                serverId: params.serverId,
              }}
              paramValue={conversation.id}
              isDirectMessage={true}
            />
          </section>
          <div className="w-full pt-[7.5rem] bg-transparent" />
          <div className="h-fit absolute bottom-0 right-0 left-0 flex-1">
            <MessageInput
              isDirectMessage={true}
              name={otherMember.profile.name}
              query={{
                serverId: params.serverId,
                conversationId: conversation.id,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
