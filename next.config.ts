/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Tên miền lưu trữ ảnh của UploadThing
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // Avatar tự tạo khi không upload ảnh
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Clerk user avatars
      }
    ]
  }
};

export default nextConfig;