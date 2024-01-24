"use client";

import { ChevronDown, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ChannelList from "@/components/sidebar-components/ChannelList";
import { CreateChannelModal } from "@/components/modals/create-channel-modal/create-channel-modal";
import DMList from "@/components/sidebar-components/DMList";
import { InviteModal } from "@/components/modals/invite-code/imvite-code-modal";
import { IMember, IServer } from "@/typing/model-types";
import { Channel } from "@prisma/client";
import { useEffect, useState } from "react";

export const SheetMenu = ({
  server,
  mutateServerId,
}: {
  server: IServer;
  mutateServerId: () => void;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient || !server) {
    return null;
  }
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-full h-full flex z-20 flex-col inset-0">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-around bg-gray-800  w-full">
              <h1 className="text-indigo-400 text-lg font-semibold px-4 py-2 uppercase">
                {server.name}
              </h1>
            </div>
            <a
              href="#"
              className=" text-white group flex items-center px-2 py-2 mb-2 tracking-wider text-base font-medium rounded-md gap-x-2 justify-between"
            >
              channels
              <ChevronDown className="w-4 h-5 text-gray-200" />
            </a>
            <ChannelList
              channels={server.channels as unknown as Channel[]}
              mutateServerId={mutateServerId}
            />
            <DMList
              members={server.members as IMember[]}
              mutateServerId={mutateServerId}
              myId=""
            />
            <div className="flex-shrink-0 flex bg-gray-600 p-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-300 text-sm">
                  Members: {server.members?.length}
                </span>
                <InviteModal server={server} />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
