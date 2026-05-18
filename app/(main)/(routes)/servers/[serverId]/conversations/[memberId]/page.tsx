import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: Promise<{
    serverId: string;
    memberId: string;
  }>;
  searchParams: Promise<{
    video?: string;
  }>;
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, memberId } = await params;
  const { video } = await searchParams;

  if (!profile) return redirect("/sign-in");

  const currentMember = await db.member.findFirst({
    where: { serverId, profileId: profile.id },
    include: { profile: true },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(currentMember.id, memberId);

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOneId, memberTwoId } = conversation;
  const otherMemberId = memberOneId === currentMember.id ? memberTwoId : memberOneId;

  const otherMember = await db.member.findFirst({
    where: { id: otherMemberId },
    include: { profile: true },
  });

  if (!otherMember) return redirect("/");

  const isVideo = video === "true";

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        conversationId={conversation.id}
      />
      {isVideo ? (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
            paramKey="conversationId"
            paramValue={conversation.id}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
