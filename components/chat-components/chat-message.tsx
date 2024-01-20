"use client";

import { Member, MemberRole, Profile } from "@prisma/client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Dayjs } from "dayjs";
import Link from "next/link";

interface ChatMessageProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: Dayjs;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
}

const ChatMessage = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
}: ChatMessageProps) => {
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  // TODO: decentralization the user ability to CRUD messages
  const fileType = fileUrl?.split(".").pop();
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <Avatar>
          <AvatarImage src={member.profile.imageUrl} />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <Link
                className="font-semibold text-sm hover:underline cursor-pointer dark:text-zinc-400"
                href={`#`}
              >
                {member.profile.name}
              </Link>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-600 tracking-tighter">
              {timestamp.format("YYYY-MM-DD HH:mm A")}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-200">
            {deleted ? "Message deleted" : content}
          </p>
          {isPDF && <Link href={fileUrl} className="text-[0.85rem] tracking-tight underline text-blue-600">
            {fileUrl}
            </Link>}
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;
