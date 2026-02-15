import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUnreadChatCount(role: "admin" | "user", userId?: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      if (role === "admin") {
        // Admin: count unread messages from users across all conversations
        const { count: unread } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("sender_role", "user")
          .eq("is_read", false);
        setCount(unread || 0);
      } else {
        // User: count unread messages from admin in own conversations
        const { data: convs } = await supabase
          .from("chat_conversations")
          .select("id")
          .eq("user_id", userId);
        if (!convs || convs.length === 0) { setCount(0); return; }
        const convIds = convs.map((c) => c.id);
        const { count: unread } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", convIds)
          .eq("sender_role", "admin")
          .eq("is_read", false);
        setCount(unread || 0);
      }
    };

    fetchCount();

    // Subscribe to new messages for live updates
    const channel = supabase
      .channel(`unread-${role}-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages" },
        () => { fetchCount(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, role]);

  return count;
}
