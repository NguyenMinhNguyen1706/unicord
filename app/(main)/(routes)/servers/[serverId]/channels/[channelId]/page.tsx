import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MemberSidebar } from "@/components/member/member-sidebar";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, channelId } = await params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  // Lấy danh sách thành viên cho sidebar phải
  const members = await db.member.findMany({
    where: {
      serverId: serverId,
    },
    include: {
      profile: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  // Lấy deadlines cho widget
  const deadlines = await db.deadline.findMany({
    where: {
      serverId: serverId,
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });

  return (
    <div className="flex h-full">
      {/* Cột 3: Chat Area */}
      <div className="flex flex-col h-full flex-1">
        <ChatHeader
          name={channel.name}
          serverId={channel.serverId}
          type="channel"
        />
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
        />
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>

      {/* Cột 4: Member List & Deadline Widget */}
      <div className="hidden lg:flex">
        <MemberSidebar
          members={members}
          deadlines={deadlines}
          serverId={serverId}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
