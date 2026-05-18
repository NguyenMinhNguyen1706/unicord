import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  // Lấy thông tin người dùng đang đăng nhập từ Clerk
  const user = await currentUser();

  // Nếu chưa đăng nhập, đá về trang đăng nhập
  if (!user) {
    return redirect("/sign-in");
  }

  // Tìm xem người dùng này đã có trong Database của mình chưa
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  // Nếu có rồi thì trả về thông tin profile đó
  if (profile) {
    return profile;
  }

  // Nếu chưa có (người dùng mới), tạo một Profile mới trong Database
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
};