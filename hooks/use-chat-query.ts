import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }: { pageParam?: string }) => {
    const url = new URL(apiUrl, window.location.origin);
    url.searchParams.set(paramKey, paramValue);
    if (pageParam) {
      url.searchParams.set("cursor", pageParam);
    }

    const res = await fetch(url.toString());
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000, // Fallback polling khi mất kết nối socket
    initialPageParam: undefined as string | undefined,
  });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
