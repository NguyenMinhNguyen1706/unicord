"use client";

import { useRef, Fragment, ElementRef } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { GraduationCap, Loader2, ServerCrash, Pin, MoreHorizontal, Pencil, Copy, Trash2, SmilePlus, FileIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useModal } from "@/components/providers/modal-provider";
import { ChatItem } from "@/components/chat/chat-item";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  type,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-[#0E1628]">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Đang tải tin nhắn...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-[#0E1628]">
        <ServerCrash className="h-8 w-8 text-red-500 mb-3" />
        <p className="text-sm text-slate-500">Đã xảy ra lỗi khi tải tin nhắn.</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col overflow-y-auto px-4 py-4 bg-white dark:bg-[#0E1628]">
      {/* Phần trên cùng - khi không còn tin nhắn cũ */}
      {!hasNextPage && (
        <div className="flex flex-col items-center justify-center mb-8 mt-auto">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Chào mừng đến #{name}!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
            Đây là kênh <span className="font-semibold">#{name}</span>. Hãy bắt đầu cuộc trò chuyện!
          </p>
        </div>
      )}

      {/* Nút load thêm */}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-violet-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-xs text-violet-500 hover:text-violet-600 my-4 transition"
            >
              Tải tin nhắn cũ hơn
            </button>
          )}
        </div>
      )}

      {/* Danh sách tin nhắn */}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group: any, i: number) => (
          <Fragment key={i}>
            {group.items.map((message: any) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), "dd/MM/yyyy HH:mm")}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
