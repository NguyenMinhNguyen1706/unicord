"use client";

import { Plus } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <button
        onClick={() => onOpen("createServer")}
        className="group flex items-center"
        title="Tạo Server mới"
      >
        <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-slate-800/80 hover:bg-violet-600 shadow-md">
          <Plus
            className="group-hover:text-white transition text-violet-400"
            size={24}
          />
        </div>
      </button>
    </div>
  );
};
