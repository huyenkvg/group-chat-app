import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

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
    // TODO: bring localhost 3000 to ENV named NEXT_PUBLIC_URL
    return redirectToSignIn({
      returnBackUrl: `http://localhost:3000/invite/${inviteCode}`,
    });
  }

  if (!inviteCode) {
    return redirect("/");
  }
  // The user is already a member of the server
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
    return redirect(`/servers/${existingServer.id}`);
  }
  try {
    const server = await db.server.update({
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
    });

    if (server) {
      return redirect(`/servers/${server.id}`);
    }
  } catch (error) {
    console.error("[FAIL_JOIN_SERVER]", error);
  }

  return '/';
};

export default InviteCodePage;
