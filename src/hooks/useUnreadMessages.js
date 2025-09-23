import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";

const useUnreadMessages = () => {
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Error parsing currentUser from localStorage:", error);
      return null;
    }
  })();

  const { data: unreadCount = 0, error, isLoading } = useQuery({
    queryKey: ["unreadMessages"],
    queryFn: () => newRequest.get("/conversations/unread-count").then((res) => res.data.unreadCount),
    enabled: !!currentUser, // Only run if user is logged in
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: false,
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  return {
    unreadCount,
    isLoading,
    error,
  };
};

export default useUnreadMessages;
