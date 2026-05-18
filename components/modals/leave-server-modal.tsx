"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
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
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center text-slate-800 dark:text-white">
              Rời Server
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
              Bạn có chắc muốn rời khỏi <span className="font-semibold text-violet-500">{server?.name}</span>?
              <br />
              <span className="text-xs text-slate-400">Bạn sẽ cần link mời để quay lại.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isLoading} variant="outline" onClick={onClose}>Hủy</Button>
            <Button disabled={isLoading} onClick={onClick} className="bg-amber-500 hover:bg-amber-600 text-white">
              {isLoading ? "Đang rời..." : "Rời Server"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
