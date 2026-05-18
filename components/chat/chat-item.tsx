"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Member, Profile } from "@prisma/client";
import { MemberRole } from "@/enums";
import { useModal } from "@/components/providers/modal-provider";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Pencil,
  Trash2,
  FileIcon,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap: Record<string, React.ReactNode> = {
  TEACHER: <GraduationCap className="h-4 w-4 text-violet-500 ml-1" />,
  LEADER: <ShieldCheck className="h-4 w-4 text-amber-500 ml-1" />,
  STUDENT: <Users className="h-3.5 w-3.5 text-blue-500 ml-1" />,
  GUEST: null,
};

const roleColors: Record<string, string> = {
  TEACHER: "text-violet-600 dark:text-violet-400",
  STUDENT: "text-blue-600 dark:text-blue-400",
  LEADER: "text-amber-600 dark:text-amber-400",
  GUEST: "text-slate-600 dark:text-slate-400",
};

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const fileType = fileUrl?.split(".").pop();
  const isTeacher = currentMember.role === MemberRole.TEACHER;
  const isLeader = currentMember.role === MemberRole.LEADER;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isTeacher || isLeader || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const onSaveEdit = async () => {
    try {
      const url = `${socketUrl}/${id}?${new URLSearchParams(socketQuery).toString()}`;
      await axios.patch(url, { content: editContent });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cn(
      "group relative flex items-start gap-x-3 py-2 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors",
      deleted && "opacity-60"
    )}>
      {/* Avatar */}
      <button onClick={onMemberClick} className="relative flex-shrink-0 cursor-pointer">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
          member.role === "TEACHER"
            ? "bg-gradient-to-br from-violet-500 to-purple-600"
            : "bg-gradient-to-br from-blue-500 to-cyan-600"
        )}>
          {member.profile?.imageUrl ? (
            <Image src={member.profile.imageUrl} alt="" fill className="rounded-full object-cover" />
          ) : (
            member.profile?.name?.charAt(0) || "?"
          )}
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-x-2">
          <button onClick={onMemberClick} className="cursor-pointer">
            <span className={cn("font-semibold text-sm hover:underline", roleColors[member.role])}>
              {member.profile?.name}
            </span>
          </button>
          {roleIconMap[member.role]}
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{timestamp}</span>
        </div>

        {/* File đính kèm - Ảnh */}
        {isImage && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative mt-2 inline-block rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 max-w-[300px]">
            <Image src={fileUrl} alt={content} width={300} height={200} className="object-cover" />
          </a>
        )}

        {/* File đính kèm - PDF */}
        {isPDF && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 p-3 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 max-w-xs hover:bg-slate-200/50 dark:hover:bg-white/10 transition">
            <FileIcon className="h-8 w-8 text-violet-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-violet-500 truncate">Tệp PDF đính kèm</p>
              <p className="text-xs text-slate-400">Nhấn để tải xuống</p>
            </div>
          </a>
        )}

        {/* Nội dung tin nhắn */}
        {!fileUrl && !isEditing && (
          <p className={cn(
            "text-sm text-slate-700 dark:text-slate-300 mt-0.5 whitespace-pre-wrap leading-relaxed",
            deleted && "italic text-slate-500 dark:text-slate-400 text-xs"
          )}>
            {content}
            {isUpdated && !deleted && (
              <span className="text-[10px] text-slate-400 ml-1">(đã chỉnh sửa)</span>
            )}
          </p>
        )}

        {/* Form chỉnh sửa */}
        {!fileUrl && isEditing && (
          <div className="flex items-center gap-2 mt-1">
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
              className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button onClick={onSaveEdit} className="p-1 rounded-md bg-violet-500 text-white hover:bg-violet-600">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-1 rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        )}
      </div>

      {/* Hover actions */}
      {canDeleteMessage && !isEditing && (
        <div className="absolute -top-2 right-2 hidden group-hover:flex items-center gap-0.5 bg-white dark:bg-[#1A1A2E] border border-slate-200 dark:border-white/10 rounded-md shadow-lg px-1 py-0.5">
          {canEditMessage && (
            <button onClick={() => setIsEditing(true)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5" title="Sửa">
              <Pencil className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
            </button>
          )}
          <button
            onClick={() => onOpen("deleteMessage", {
              apiUrl: `${socketUrl}/${id}`,
              query: socketQuery,
            })}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};
