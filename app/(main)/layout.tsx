import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full bg-gradient-to-tr from-indigo-500 to-#F8F8F8">
      <div className="hidden md:flex h-full w-[4rem] z-30 flex-col fixed inset-y-0 bg-  ">
      <div className="p-3 mt-auto flex items-center flex-col gap-y-4 ">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px] rounded-full"
            }
          }}
        />
      </div>
      </div>
      <main className="md:pl-[4rem] h-full ">
        {children}
      </main>
    </div>
   );
}
 
export default MainLayout;