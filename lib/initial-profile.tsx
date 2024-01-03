import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function initialProfile(): Promise<{
  id: string;
  userId: string;
  email: string;
  imageUrl: string;
  name: string;
}> {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const profile = await db.profile.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!profile) {
    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        name: user.firstName + " " + user.lastName,
      },
    });
    return newProfile;
  }
  return profile;
}
