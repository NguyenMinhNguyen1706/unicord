import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/enums";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { channelId } = await params;
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID Missing", { status: 400 });
    if (!channelId) return new NextResponse("Channel ID Missing", { status: 400 });
    if (name === "thông-báo" || name === "general") {
      return new NextResponse("Name cannot be 'thông-báo' or 'general'", { status: 400 });
    }

    // Kiểm tra quyền TEACHER hoặc LEADER
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.TEACHER, MemberRole.LEADER] },
          },
        },
      },
    });

    if (!server) return new NextResponse("Forbidden", { status: 403 });

    const channel = await db.channel.update({
      where: {
        id: channelId,
        NOT: { name: "thông-báo" },
      },
      data: { name, type },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { channelId } = await params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID Missing", { status: 400 });
    if (!channelId) return new NextResponse("Channel ID Missing", { status: 400 });

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.TEACHER, MemberRole.LEADER] },
          },
        },
      },
    });

    if (!server) return new NextResponse("Forbidden", { status: 403 });

    const channel = await db.channel.delete({
      where: {
        id: channelId,
        NOT: { name: "thông-báo" },
      },
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
