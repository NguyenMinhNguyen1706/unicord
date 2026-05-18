import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/server-socket";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await currentUser();
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!conversationId) return res.status(400).json({ error: "Conversation ID missing" });
    if (!content) return res.status(400).json({ error: "Content missing" });

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) return res.status(401).json({ error: "Profile not found" });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOneId: { in: (await db.member.findMany({ where: { profileId: profile.id }, select: { id: true } })).map(m => m.id) } },
          { memberTwoId: { in: (await db.member.findMany({ where: { profileId: profile.id }, select: { id: true } })).map(m => m.id) } },
        ],
      },
    });

    if (!conversation) return res.status(404).json({ error: "Conversation not found" });

    // Tìm member phù hợp
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        id: { in: [conversation.memberOneId, conversation.memberTwoId] },
      },
    });

    if (!member) return res.status(404).json({ error: "Member not found" });

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: { include: { profile: true } },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
