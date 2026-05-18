import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/server-socket";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { MemberRole } from "@/enums";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await currentUser();
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!serverId) return res.status(400).json({ error: "Server ID missing" });
    if (!channelId) return res.status(400).json({ error: "Channel ID missing" });

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) return res.status(401).json({ error: "Profile not found" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    });

    if (!server) return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: { id: channelId as string, serverId: serverId as string },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const member = server.members.find((m) => m.profileId === profile.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    let message = await db.message.findFirst({
      where: { id: messageId as string, channelId: channelId as string },
      include: { member: { include: { profile: true } } },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isTeacher = member.role === MemberRole.TEACHER;
    const isLeader = member.role === MemberRole.LEADER;
    const canModify = isMessageOwner || isTeacher || isLeader;

    if (!canModify) return res.status(403).json({ error: "Forbidden" });

    if (req.method === "DELETE") {
      // Soft delete - đánh dấu deleted thay vì xóa thật
      message = await db.message.update({
        where: { id: messageId as string },
        data: {
          fileUrl: null,
          content: "Tin nhắn này đã bị xóa.",
          deleted: true,
        },
        include: { member: { include: { profile: true } } },
      });
    }

    if (req.method === "PATCH") {
      // Chỉ chủ tin nhắn mới được sửa
      if (!isMessageOwner) return res.status(403).json({ error: "Forbidden" });

      message = await db.message.update({
        where: { id: messageId as string },
        data: { content },
        include: { member: { include: { profile: true } } },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
