import React from "react";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      profileId: profile.id,
    },
  });
  if (server) {
    redirect(`/server/${server.id}`);
  }
  return <div>{/* TODO: create modal create a server */}</div>;
};

export default SetupPage;
