"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Dot } from "lucide-react";
export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className=" ttext-orange-700 border-none rounded-full px-2 py-1 flex flex-row items-center">
        <Dot className="text-gray-500 w-10 h-10" />
        <p className="hidden md:block">connecting...</p>
      </div>
    );
  }

  return (
    <div className="  text-green-700 border-none rounded-full px-2 py-1 flex flex-row items-center">
      <Dot className="text-green-600 w-10 h-10
      " />
     <p className="hidden md:block">connected</p>
    </div>
  );
};
