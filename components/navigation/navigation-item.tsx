"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({
  id,
  imageUrl,
  name,
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center"
      title={name}
    >
      {/* Indicator bar */}
      <div
        className={cn(
          "absolute left-0 bg-white rounded-r-full transition-all w-[4px]",
          params?.serverId !== id && "group-hover:h-[20px]",
          params?.serverId === id ? "h-[36px]" : "h-[8px]"
        )}
      />
      {/* Server icon */}
      <div
        className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden shadow-md",
          params?.serverId === id &&
            "bg-primary/10 text-primary rounded-[16px] ring-2 ring-violet-500/40"
        )}
      >
        <Image fill src={imageUrl} alt={name} className="object-cover" />
      </div>
    </button>
  );
};
