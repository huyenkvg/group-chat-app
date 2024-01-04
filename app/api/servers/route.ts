import { currentProfile } from "@/lib/current-profile";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuid(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
              type: "TEXT",
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: "ADMIN",
            },
          ],
        },
      },
    });
    return new Response(
      JSON.stringify({
        server,
        message: "Server created successfully",
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
