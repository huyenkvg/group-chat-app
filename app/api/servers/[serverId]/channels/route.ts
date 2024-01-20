import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();

    const { serverId } = params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const existingServer = await db.server.findUnique({
      where: { id: serverId },
    });

    if (!existingServer) {
      return NextResponse.json(
        { message: "Server not found" },
        { status: 404 }
      );
    }

    const existingMember = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
        role: {
          in: [MemberRole.ADMIN, MemberRole.MODERATOR],
        },
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        {
          message: "Forbidden: You don't have permission to create channel.",
        },
        { status: 403 }
      );
    }
    const updatedServer = await db.server.update({
      where: { id: serverId },
      data: {
        channels: {
          create: [
            {
              profileId: profile.id,
              name,
              type,
            },
          ],
        },
      },
    });

    return NextResponse.json(updatedServer);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
