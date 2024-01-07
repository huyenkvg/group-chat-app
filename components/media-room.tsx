"use client";

import React, { useEffect, useState } from "react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import {
  LiveKitRoom,
  SpinnerIcon,
  VideoConference,
} from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";

export interface MediaRoomProps {
  chatId: Channel["id"];
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex items-center justify-center h-full">
        <SpinnerIcon className="text-blue-500 animate-spin origin-center" />
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
