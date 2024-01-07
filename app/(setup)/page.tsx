import React from "react";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/init-modals/initial-modal";
import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

const SetupPage = async () => {
  const profile = await initialProfile();
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="h-screen w-full">
      <div className="font-bold w-full max-w-2xl  bg-indigo-50 h-screen px-10 pt-20 mx-auto 2xl:px-24">
        <h1 className=" text-indigo-500 font-semibold uppercase text-xl text-center">
          Server List
        </h1>

        <ul className="gap-y-4 flex flex-col  w-full overflow-y-auto  py-8 ">
          {servers.map((server) => (
            <li
              key={server.id}
              className="w-full flex flex-row justify-between  items-center"
            >
              <Link
                href={`/servers/${server.id}`}
                className="w-full text-cyan-500 flex flex-row gap-x-4 items-center"
              >
                <div className="h-10 w-10 relative">
                  <Image
                    fill
                    src={server.imageUrl}
                    alt={server.name}
                    className="rounded-md h-16 w-16"
                  />
                </div>
                {server.name}
              </Link>
              {server.profileId === profile.id && (
                <span className="text-rose-500 font-light flex flex-row items-center">
                  Owner
                  <Shield className="w-4 h-4 ml-2" />
                </span>
              )}
            </li>
          ))}
        </ul>
          <InitialModal />
      </div>
    </div>
  );
};

export default SetupPage;
