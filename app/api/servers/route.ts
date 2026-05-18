import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

import { ChannelType } from "@/enums";;
import { MemberRole } from "@/enums";;

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const finalImageUrl = imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=256`;
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Tìm hoặc tạo profile
    let profile = await db.profile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
        }
      });
    }

    // Tạo Server với template học thuật UniCord
    // Tự động tạo các channel mặc định cho lớp học
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl: finalImageUrl,
        inviteCode: uuidv4(),
        templateType: "university",
        channels: {
          create: [
            // TEXT Channels - theo doc §3.2
            { name: "thông-báo", type: ChannelType.TEXT, profileId: profile.id, position: 0 },
            { name: "bài-tập", type: ChannelType.TEXT, profileId: profile.id, position: 1 },
            { name: "tài-liệu", type: ChannelType.TEXT, profileId: profile.id, position: 2 },
            { name: "hỏi-đáp", type: ChannelType.TEXT, profileId: profile.id, position: 3 },
            { name: "linh-tinh", type: ChannelType.TEXT, profileId: profile.id, position: 4 },
            // VOICE Channels - Phòng học nhóm thường trực
            { name: "Phòng học nhóm A", type: ChannelType.AUDIO, profileId: profile.id, position: 5 },
            { name: "Phòng học nhóm B", type: ChannelType.AUDIO, profileId: profile.id, position: 6 },
          ]
        },
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.TEACHER }
          ]
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

