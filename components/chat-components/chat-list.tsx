"use client";

import { Fragment, useRef, ElementRef } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";
import dayjs from "dayjs";
import ChatMessage from "./chat-message";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatListProps {
  name: string;
  member: Member;
  chatId: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  isDirectMessage?: boolean;
}

export const ChatList = ({
  name,
  chatId,
  paramKey,
  member,
  paramValue,
  isDirectMessage = false,
}: ChatListProps) => {
  const apiUrl = isDirectMessage ? "/api/direct-messages" : "/api/messages";
  
  // This key allow the ServerSocket io to emit a message to this chat to update the chat list
  const queryKey = `chat:${chatId}`; 

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const {
    data,
    fetchOlderMessages,
    hasPreviousMessages,
    isFetchingOlderMessages,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  useChatSocket({
    queryKey,
    // This key allow the ServerSocket io to emit a message after a message is created, and we can listen to it to update the chat list.
    addKey: `chat:${chatId}:messages`, 
    // Same as above, but for when a message is updated.
    updateKey: `chat:${chatId}:messages:update`,
  });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchOlderMessages,
    shouldLoadMore: !isFetchingOlderMessages && !!hasPreviousMessages,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasPreviousMessages && <div className="flex-1" />}
      {!hasPreviousMessages && (
        <div className="flex justify-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {`--- Start of ${name} ---`}
          </p>
        </div>
      )}
      {hasPreviousMessages && (
        <div className="flex justify-center">
          {isFetchingOlderMessages ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchOlderMessages()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load more older messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group: any, index: number) => (
          <Fragment key={index}>
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={dayjs(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
