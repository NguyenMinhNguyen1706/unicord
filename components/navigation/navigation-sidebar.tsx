import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";
import { GraduationCap, CalendarDays } from "lucide-react";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

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
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#1A1A2E] py-3">
      {/* Logo UniCord */}
      <div className="group flex items-center">
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 group-hover:from-violet-500 group-hover:to-indigo-500 shadow-lg">
          <GraduationCap className="text-white h-6 w-6 transition-transform group-hover:scale-110" />
        </div>
      </div>

      <Separator className="h-[2px] bg-white/10 rounded-md w-10 mx-auto" />

      {/* Deadline tổng hợp */}
      <div className="group flex items-center">
        <button className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-slate-800/80 hover:bg-emerald-600 shadow-md" title="Tất cả Deadline">
          <CalendarDays className="text-emerald-400 group-hover:text-white h-5 w-5 transition-colors" />
        </button>
      </div>

      <Separator className="h-[2px] bg-white/10 rounded-md w-10 mx-auto" />

      {/* Danh sách Server */}
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>

      {/* Thêm Server mới */}
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <NavigationAction />
        <Separator className="h-[2px] bg-white/10 rounded-md w-10 mx-auto" />
        <div className="relative">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-[42px] w-[42px] rounded-full ring-2 ring-white/20 hover:ring-violet-500/50 transition-all"
              }
            }}
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#1A1A2E]" />
        </div>
      </div>
    </div>
  );
};
