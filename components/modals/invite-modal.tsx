"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Check, Copy, RefreshCw, Link2 } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const InviteModal = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/invite/${server?.inviteCode}`
    : "";

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: response.data });
      router.refresh();
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
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Mời Thành Viên
              </DialogTitle>
            </div>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Chia sẻ link bên dưới để mời bạn bè vào server <span className="font-semibold text-violet-500">{server?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Link mời tham gia Server
            </Label>
            <div className="flex items-center gap-x-2">
              <Input
                disabled={isLoading}
                className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-lg text-sm font-mono"
                value={inviteUrl}
                readOnly
              />
              <Button
                disabled={isLoading}
                onClick={onCopy}
                size="icon"
                className="flex-shrink-0 bg-violet-500 hover:bg-violet-600 text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              onClick={onNew}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-slate-500 hover:text-violet-500 mt-2"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Tạo link mới
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
