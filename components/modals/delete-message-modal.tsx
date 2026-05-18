"use client";

import { useState } from "react";
import axios from "axios";
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
import { Trash2 } from "lucide-react";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = `${apiUrl}?${new URLSearchParams(query as Record<string, string>).toString()}`;
      await axios.delete(url);
      onClose();
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
              Xóa Tin Nhắn
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
              Tin nhắn sẽ bị xóa vĩnh viễn. Bạn có chắc không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isLoading} variant="outline" onClick={onClose}>Hủy</Button>
            <Button disabled={isLoading} onClick={onClick} className="bg-red-500 hover:bg-red-600 text-white">
              {isLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
