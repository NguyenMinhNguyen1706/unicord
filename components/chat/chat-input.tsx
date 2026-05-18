"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Plus, Smile, Send } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onOpen } = useModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const url = `${apiUrl}?${new URLSearchParams(query as Record<string, string>).toString()}`;
      await axios.post(url, { content });
      setContent("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 bg-white dark:bg-[#0E1628]">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 focus-within:border-violet-500/30 focus-within:ring-2 focus-within:ring-violet-500/10 transition-all">
          {/* Attach file */}
          <button
            type="button"
            onClick={() => onOpen("messageFile", { apiUrl, query })}
            className="p-3 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-l-xl transition-colors"
            title="Đính kèm file"
          >
            <Plus className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Input */}
          <input
            disabled={isLoading}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Nhắn tin vào ${type === "channel" ? "#" : ""}${name}`}
            className="flex-1 bg-transparent px-2 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-1 pr-2">
            <button type="button" className="p-1.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors" title="Emoji">
              <Smile className="h-4 w-4 text-slate-400" />
            </button>
            {content.trim() && (
              <button
                type="submit"
                disabled={isLoading}
                className="p-1.5 rounded-md bg-violet-500 hover:bg-violet-600 transition-colors ml-1 disabled:opacity-50"
                title="Gửi"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
