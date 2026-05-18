"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Settings,
  UserPlus,
  Users,
  PlusCircle,
  Trash,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isTeacher = role === MemberRole.TEACHER;
  const isLeader = role === MemberRole.LEADER;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-sm font-semibold px-3 flex items-center h-12 border-b-2 border-slate-200 dark:border-white/5 hover:bg-slate-200/50 dark:hover:bg-white/5 transition bg-slate-50 dark:bg-[#16213E]">
          <GraduationCap className="h-4 w-4 mr-2 text-violet-500" />
          <span className="truncate">{server.name}</span>
          <ChevronDown className="h-5 w-5 ml-auto text-slate-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-slate-600 dark:text-slate-300 space-y-[2px] bg-white dark:bg-[#1A1A2E] border-slate-200 dark:border-white/10">
        {(isTeacher || isLeader) && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-violet-600 dark:text-violet-400 px-3 py-2 text-sm cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-500/10"
          >
            Mời sinh viên
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isTeacher && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Cài đặt Server
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isTeacher && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Quản lý thành viên
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {(isTeacher || isLeader) && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Tạo kênh mới
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {(isTeacher || isLeader) && <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/5" />}
        {isTeacher && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            Xóa Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isTeacher && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            Rời Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

