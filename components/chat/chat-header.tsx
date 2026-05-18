import { Hash, Users } from "lucide-react";
import { SocketIndicator } from "@/components/socket-indicator";
import { MobileToggle } from "@/components/mobile-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  conversationId?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  conversationId,
}: ChatHeaderProps) => {
  return (
    <div className="text-sm font-semibold px-4 flex items-center h-12 border-b-2 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0E1628]/50 backdrop-blur-sm">
      <MobileToggle>
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <div className="flex-1 w-60">
          <ServerSidebar serverId={serverId} />
        </div>
      </MobileToggle>
      {type === "channel" && (
        <Hash className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" />
      )}
      {type === "conversation" && imageUrl && (
        <div className="h-7 w-7 rounded-full overflow-hidden mr-2 bg-slate-200 dark:bg-slate-700 flex-shrink-0">
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        </div>
      )}
      <p className="font-bold text-base text-slate-800 dark:text-white">
        {name}
      </p>

      <div className="ml-auto flex items-center gap-x-3">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
        <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors" title="Danh sách thành viên">
          <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
};
