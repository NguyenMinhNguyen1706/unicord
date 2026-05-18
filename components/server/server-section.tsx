"use client";


import { ChannelType } from "@/enums";;
import { MemberRole } from "@/enums";;
import { Plus } from "lucide-react";
import { ServerWithMembersWithProfiles } from "@/types";
import { useModal } from "@/components/providers/modal-provider";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <button
          onClick={() => onOpen("createChannel", { channelType: channelType?.toString() })}
          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

