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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-green-500 text-white text-center font-bold rounded-lg border shadow-lg p-10">
          Success joining server!
        </div>
        <Image width={200} height={200} src={String(server.imageUrl)} alt={server.name} />
        <Link href={`/servers/${server.id}`}>Go to {server.name}</Link>
      </div>
    );
  } catch (error) {
    console.error("[FAIL_JOIN_SERVER]", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-500 text-white font-bold rounded-lg border shadow-lg p-10">
          Fail joining server
        </div>
      </div>
    );
  }

  // Reload the page
  return <>checking....</>;
};

export default InviteCodePage;
