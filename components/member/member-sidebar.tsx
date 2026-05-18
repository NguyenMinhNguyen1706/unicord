"use client";

import { Member, Profile, Deadline } from "@prisma/client";
import { MemberRole } from "@/enums";;
import { GraduationCap, ShieldCheck, Users, Crown, Clock, CalendarDays, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";

interface MemberSidebarProps {
  members: (Member & { profile: Profile })[];
  deadlines: Deadline[];
  serverId: string;
}

const roleIconMap: Record<string, React.ReactNode> = {
  TEACHER: <GraduationCap className="h-3.5 w-3.5 text-violet-500" />,
  LEADER: <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />,
  STUDENT: <Users className="h-3.5 w-3.5 text-blue-500" />,
  GUEST: null,
};

const roleLabelMap: Record<string, string> = {
  TEACHER: "Giảng viên",
  LEADER: "Trưởng nhóm",
  STUDENT: "Sinh viên",
  GUEST: "Khách",
};

// Deadline mẫu khi chưa có data thật
const sampleDeadlines = [
  {
    id: "d1",
    title: "Nộp bài tập lớn OOP",
    dueDate: new Date(Date.now() + 86400000 * 3),
    status: "UPCOMING" as const,
  },
  {
    id: "d2",
    title: "Quiz Online - Chương 5",
    dueDate: new Date(Date.now() + 86400000 * 7),
    status: "UPCOMING" as const,
  },
  {
    id: "d3",
    title: "Báo cáo giữa kỳ",
    dueDate: new Date(Date.now() + 86400000 * 14),
    status: "IN_PROGRESS" as const,
  },
];

export const MemberSidebar = ({
  members,
  deadlines,
  serverId,
}: MemberSidebarProps) => {
  // Group members by role
  const teachers = members.filter((m) => m.role === MemberRole.TEACHER);
  const leaders = members.filter((m) => m.role === MemberRole.LEADER);
  const students = members.filter((m) => m.role === MemberRole.STUDENT);
  const guests = members.filter((m) => m.role === MemberRole.GUEST);

  const displayDeadlines = deadlines.length > 0 ? deadlines : sampleDeadlines;

  const getDeadlineColor = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date());
    if (days <= 1) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (days <= 3) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  };

  const getDaysLeft = (dueDate: Date) => {
    const days = differenceInDays(dueDate, new Date());
    if (days <= 0) return "Hết hạn!";
    if (days === 1) return "Còn 1 ngày";
    return `Còn ${days} ngày`;
  };

  return (
    <div className="w-60 h-full bg-slate-50 dark:bg-[#0F1A2E] border-l border-slate-200 dark:border-white/5">
      <ScrollArea className="h-full">
        <div className="p-3">
          {/* Deadline Widget */}
          <div className="mb-4">
            <div className="flex items-center gap-x-2 mb-3">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Deadline sắp tới
              </h3>
            </div>
            <div className="space-y-2">
              {displayDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`p-2.5 rounded-lg border ${getDeadlineColor(deadline.dueDate)} transition-all hover:scale-[1.02] cursor-pointer`}
                >
                  <p className="text-xs font-semibold mb-1 line-clamp-1">
                    {deadline.title}
                  </p>
                  <div className="flex items-center gap-x-1.5">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-medium">
                      {getDaysLeft(deadline.dueDate)}
                    </span>
                    <span className="text-[10px] opacity-70 ml-auto">
                      {format(deadline.dueDate, "dd/MM")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-white/5 my-3" />

          {/* Members List */}
          {/* Teachers */}
          {teachers.length > 0 && (
            <MemberGroup
              label={`Giảng viên — ${teachers.length}`}
              members={teachers}
            />
          )}

          {/* Leaders */}
          {leaders.length > 0 && (
            <MemberGroup
              label={`Trưởng nhóm — ${leaders.length}`}
              members={leaders}
            />
          )}

          {/* Students */}
          {students.length > 0 && (
            <MemberGroup
              label={`Sinh viên — ${students.length}`}
              members={students}
            />
          )}

          {/* Guests */}
          {guests.length > 0 && (
            <MemberGroup
              label={`Khách — ${guests.length}`}
              members={guests}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const MemberGroup = ({
  label,
  members,
}: {
  label: string;
  members: (Member & { profile: Profile })[];
}) => {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        {label}
      </p>
      <div className="space-y-1">
        {members.map((member) => (
          <button
            key={member.id}
            className="w-full flex items-center gap-x-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="relative flex-shrink-0">
              <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                {member.profile.imageUrl ? (
                  <img
                    src={member.profile.imageUrl}
                    alt={member.profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br from-violet-500 to-indigo-600">
                    {member.profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-50 dark:border-[#0F1A2E]" />
            </div>
            <div className="flex items-center gap-x-1 min-w-0">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 truncate">
                {member.profile.name}
              </span>
              {roleIconMap[member.role]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

