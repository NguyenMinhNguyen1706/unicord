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
      }
    ]
  }
};

export default nextConfig;