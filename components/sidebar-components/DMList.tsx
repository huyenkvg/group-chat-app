"use client";

import { IMember } from "@/typing/model-types";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DMList = ({ members = [] }: { members: IMember[] }) => {
  const pathname = usePathname();
  return (
    <nav className=" flex-1 px-2 py-4 bg-gray-800 space-y-1 overflow-y-auto">
      <a
        href="#"
        className=" text-white group flex items-center px-2 py-2 mb-2 tracking-wider text-base font-medium rounded-md gap-x-2 justify-between"
      >
        direct messages
        <ChevronDown className="w-4 h-5 text-gray-200" />
      </a>
      {members.map((member: IMember) => {
        const isCurrentPath = pathname?.endsWith(`/members/${member.id}`);
        return (
          <a
            key={member.id}
            href={`/servers/${member.serverId}/members/${member.id}`}
            className={cn(
              "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              isCurrentPath && "bg-gray-700 font-semibold"
            )}
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

export default DMList;
