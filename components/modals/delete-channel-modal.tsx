"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Hash, Trash2 } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/channels/${channel?.id}?serverId=${server?.id}`);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground p-0 overflow-hidden border-0 shadow-2xl max-w-md">
        <div className="p-6">
          <DialogHeader className="space-y-3 mb-6">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center text-slate-800 dark:text-white">
              Xóa Kênh
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
              Bạn có chắc muốn xóa kênh <span className="font-semibold text-violet-500">#{channel?.name}</span>?
              <br />
              <span className="text-xs text-red-400">Hành động này không thể hoàn tác.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isLoading} variant="outline" onClick={onClose}>Hủy</Button>
            <Button disabled={isLoading} onClick={onClick} className="bg-red-500 hover:bg-red-600 text-white">
              {isLoading ? "Đang xóa..." : "Xóa Kênh"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
