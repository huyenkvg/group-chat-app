import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

const Home = () => {
  return (
    <div className=" ">
      <header className="bg-indigo-500 py-2 ">
        <div className="container flex items-center justify-between ">
          <h1 className="text-white text-2xl font-bold">Chat Application</h1>
          <div className="flex items-center  gap-x-6 ">
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
