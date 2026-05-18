"use client";

import { Channel, Server } from "@prisma/client";
import { ChannelType } from "@/enums";
import { MemberRole } from "@/enums";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Hash, Mic, Video, Lock, Settings, Trash } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = iconMap[channel.type as ChannelType];

  // Channel #thong-bao có icon khóa (chỉ giảng viên gửi)
  const isLocked = channel.name === "thông-báo";

  const onClick = () => {
    if (channel.type === ChannelType.TEXT) {
      router.push(`/servers/${server.id}/channels/${channel.id}`);
    } else {
      router.push(`/servers/${server.id}/voice/${channel.id}`);
    }
  };

  const onAction = (e: React.MouseEvent, action: "editChannel" | "deleteChannel") => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-[6px] rounded-md flex items-center gap-x-2 w-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors mb-1",
        params?.channelId === channel.id &&
          "bg-slate-200/70 dark:bg-white/10 text-foreground"
      )}
    >
      <Icon
        className={cn(
          "flex-shrink-0 w-4 h-4 text-slate-500 dark:text-slate-400",
          params?.channelId === channel.id &&
            "text-violet-600 dark:text-violet-400",
          channel.type === ChannelType.AUDIO && "text-emerald-600 dark:text-emerald-400"
        )}
      />
      <p
        className={cn(
          "line-clamp-1 font-medium text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition text-left",
          params?.channelId === channel.id &&
            "text-slate-900 dark:text-white font-semibold"
        )}
      >
        {channel.name}
      </p>
      {isLocked && (
        <Lock className="ml-auto h-3 w-3 text-amber-500/70" />
      )}
      {!isLocked && role !== MemberRole.GUEST && role !== MemberRole.STUDENT && (
        <div className="ml-auto flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={(e) => onAction(e, "editChannel")} className="hover:text-slate-600 dark:hover:text-slate-300">
            <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <button onClick={(e) => onAction(e, "deleteChannel")} className="hover:text-red-500">
            <Trash className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      )}
      {/* Hiệu ứng khi có tin chưa đọc */}
      {channel.type === ChannelType.AUDIO && (
        <div className="ml-auto flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </button>
  );
};
