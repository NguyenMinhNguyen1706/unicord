"use client";

import { Member, Profile, Server } from "@prisma/client";
import { MemberRole } from "@/enums";;
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck, Crown, Users, GraduationCap } from "lucide-react";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.STUDENT]: <Users className="h-3.5 w-3.5 ml-1 text-blue-500" />,
  [MemberRole.LEADER]: <ShieldCheck className="h-3.5 w-3.5 ml-1 text-amber-500" />,
  [MemberRole.TEACHER]: <GraduationCap className="h-3.5 w-3.5 ml-1 text-violet-500" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role as MemberRole];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-[6px] rounded-md flex items-center gap-x-2 w-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors mb-1",
        params?.memberId === member.id && "bg-slate-200/70 dark:bg-white/10"
      )}
    >
      <div className="relative">
        <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-700">
          {member.profile.imageUrl && (
            <img
              src={member.profile.imageUrl}
              alt={member.profile.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-slate-100 dark:border-[#16213E]" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition truncate">
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

