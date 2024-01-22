import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { Server } from "@prisma/client";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({
  params: { inviteCode },
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn({
      returnBackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${inviteCode}`,
    });
  }

  if (inviteCode) {
    const existingServer = await db.server.findUnique({
      where: {
        inviteCode,
      },
      include: {
        members: true,
      },
    });
    // Redirect him/her to the existed server page

    if (!existingServer) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-500 bg-opacity-40 text-white font-bold rounded-lg border shadow-lg p-10">
            Fail joining server / or invite code has been expired
          </div>
        </div>
      );
    }

    if (
      existingServer &&
      existingServer?.members.find((m) => m.profileId === profile.id)
    ) {
      redirect(`/servers/${existingServer.id}`);
    }
    try {
      const member = await db.member.create({
        data: {
          profileId: profile.id,
          serverId: existingServer.id,
        },
      });
    } catch (error) {
      console.log("[FAIL_JOIN_SERVER]", error);
    }
    redirect(`/servers/${existingServer.id}`);
  }
  // The user is already a member of the server

  // Reload the page
  return <>checking....</>;
};

export default InviteCodePage;
