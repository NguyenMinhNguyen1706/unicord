"use client";

import { FileIcon, X, ImagePlus, Upload as UploadIcon } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({
  onChange,
  value,
  endpoint
}: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  // Nếu đã upload thành công và file là ảnh, hiển thị ảnh đó ra
  if (value && fileType !== "pdf") {
    return (
      <div className="relative">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 hover:border-primary/40 transition-colors shadow-lg">
          <Image
            fill
            src={value}
            alt="Upload"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
        </div>
        <button
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          type="button"
          title="Xóa ảnh"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    )
  }

  // Nếu chưa có file, hiển thị khung Dropzone để người dùng tải lên
  const Upload = UploadDropzone as any;
  
  return (
    <div className="w-full">
      <style>{`
        .ut-button:after {
          display: none;
        }
        .ut-button {
          @apply bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all;
        }
        .ut-allowed-content {
          @apply text-slate-600 dark:text-slate-400;
        }
        .ut-upload-icon {
          color: rgb(124, 58, 237);
        }
      `}</style>
      <Upload
        endpoint={endpoint}
        onClientUploadComplete={(res: any) => {
          onChange(res?.[0]?.url); // Lấy đường dẫn ảnh lưu vào form
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
        appearance={{
          button: "ut-ready:bg-gradient-to-r ut-ready:from-primary ut-ready:to-accent hover:ut-ready:shadow-lg ut-ready:transition-all",
          allowedContent: "text-sm text-slate-600 dark:text-slate-400",
        }}
      />
    </div>
  )
}