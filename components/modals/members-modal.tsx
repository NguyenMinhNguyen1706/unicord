"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Users,
  MoreVertical,
  ShieldCheck,
  GraduationCap,
  UserMinus,
  Check,
  Shield,
  Loader2,
} from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import { MemberRole } from "@/enums";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

const roleIconMap: Record<string, React.ReactNode> = {
  TEACHER: <GraduationCap className="h-4 w-4 text-violet-500" />,
  LEADER: <ShieldCheck className="h-4 w-4 text-amber-500" />,
  STUDENT: null,
  GUEST: null,
};

const roleLabelMap: Record<string, string> = {
  TEACHER: "Giảng viên",
  LEADER: "Trưởng nhóm",
  STUDENT: "Sinh viên",
  GUEST: "Khách",
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data;

  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setLoadingId(memberId);
      const response = await axios.patch(`/api/members/${memberId}?serverId=${server?.id}`, { role });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const response = await axios.delete(`/api/members/${memberId}?serverId=${server?.id}`);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground overflow-hidden border-0 shadow-2xl max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">
              Quản Lý Thành Viên
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-sm">
            {server?.members?.length} thành viên
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-[420px] pr-4">
          {server?.members?.map((member: any) => (
            <div
              key={member.id}
              className="flex items-center gap-x-3 py-3 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors mb-1"
            >
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                {member.profile?.imageUrl ? (
                  <img src={member.profile.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-violet-500 to-indigo-600">
                    {member.profile?.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-x-1.5">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {member.profile?.name}
                  </span>
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {member.profile?.email}
                </p>
              </div>

              {/* Actions (không hiện cho TEACHER - chủ server) */}
              {server.profileId !== member.profileId && loadingId !== member.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left" className="bg-white dark:bg-[#1A1A2E] border-slate-200 dark:border-white/10">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center text-sm cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>Vai trò</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-white dark:bg-[#1A1A2E] border-slate-200 dark:border-white/10">
                          <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.LEADER)} className="text-sm cursor-pointer">
                            <ShieldCheck className="h-4 w-4 mr-2 text-amber-500" />
                            Trưởng nhóm
                            {member.role === MemberRole.LEADER && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.STUDENT)} className="text-sm cursor-pointer">
                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                            Sinh viên
                            {member.role === MemberRole.STUDENT && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.GUEST)} className="text-sm cursor-pointer">
                            <Shield className="h-4 w-4 mr-2 text-slate-400" />
                            Khách
                            {member.role === MemberRole.GUEST && <Check className="h-4 w-4 ml-auto" />}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/5" />
                    <DropdownMenuItem onClick={() => onKick(member.id)} className="text-rose-500 text-sm cursor-pointer">
                      <UserMinus className="h-4 w-4 mr-2" />
                      Đuổi khỏi Server
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {loadingId === member.id && (
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
