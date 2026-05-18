import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@/enums";
import { VoiceRoomClient } from "./voice-room-client";
import { MobileToggle } from "@/components/mobile-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";

interface VoiceChannelPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const VoiceChannelPage = async ({ params }: VoiceChannelPageProps) => {
  const profile = await currentProfile();
  const { serverId, channelId } = await params;

  if (!profile) return redirect("/sign-in");

  const channel = await db.channel.findUnique({
    where: { id: channelId },
  });

  const member = await db.member.findFirst({
    where: { serverId, profileId: profile.id },
    include: { profile: true },
  });

  if (!channel || !member) return redirect("/");

  const isVideo = channel.type === ChannelType.VIDEO;

  return (
    <VoiceRoomClient
      channelId={channelId}
      channelName={channel.name}
      channelType={channel.type}
      isVideo={isVideo}
      serverId={serverId}
      mobileToggle={
        <MobileToggle>
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <div className="flex-1 w-60">
            <ServerSidebar serverId={serverId} />
          </div>
        </MobileToggle>
      }
    />
  );
};

export default VoiceChannelPage;
