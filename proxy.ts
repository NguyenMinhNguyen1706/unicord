import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Chỉ định các trang không cần đăng nhập cũng vào được (ví dụ trang login, register)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // Nếu không phải trang công khai, thì yêu cầu đăng nhập
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Bỏ qua các file hệ thống và file tĩnh
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Luôn áp dụng cho API routes
    '/(api|trpc)(.*)',
  ],
};