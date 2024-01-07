import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import Link from "next/link";
import Image from "next/image";
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
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });
    // Redirect him/her to the existed server page
    if (existingServer) {
      redirect(`/servers/${existingServer.id}`);
    }
    try {
      const server = await db.server
        .update({
          where: {
            inviteCode: inviteCode,
          },
          data: {
            members: {
              create: [
                {
                  profileId: profile.id,
                },
              ],
            },
          },
        })
        .then((server) => {
          redirect(`/servers/${server.id}`);
        });
    } catch (error) {
      console.error("[FAIL_JOIN_SERVER]", error);
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-500 bg-opacity-40 text-white font-bold rounded-lg border shadow-lg p-10">
            Fail joining server / or invite code has been expired
          </div>
        </div>
      );
    }
  }
  // The user is already a member of the server

  // Reload the page
  return <>checking....</>;
};

export default InviteCodePage;
