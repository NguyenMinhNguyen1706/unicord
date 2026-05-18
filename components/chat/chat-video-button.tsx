"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || "",
      query: {
        video: isVideo ? undefined : true,
      }
    }, { skipNull: true });

    router.push(url);
  }

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "Tắt video call" : "Gọi video";

  return (
    <button onClick={onClick} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors" title={tooltipLabel}>
      <Icon className={`h-4 w-4 ${isVideo ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-violet-500"}`} />
    </button>
  );
}
