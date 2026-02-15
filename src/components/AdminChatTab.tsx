import { useState, useRef, useEffect } from "react";
import { Send, Image, User, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChat, ChatConversation } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const AdminChatTab = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    loading,
    sendMessage,
    uploadImage,
    markAsRead,
  } = useChat(user?.id, "admin");

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Fetch user names for conversations
  useEffect(() => {
    if (conversations.length === 0) return;
    const userIds = [...new Set(conversations.map((c) => c.user_id))];
    supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        data?.forEach((p) => (map[p.user_id] = p.full_name));
        setUserNames(map);
      });
  }, [conversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Mark user messages as read when viewing
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      const unread = messages
        .filter((m) => m.sender_role === "user" && !m.is_read)
        .map((m) => m.id);
      markAsRead(unread);
    }
  }, [activeConversationId, messages, markAsRead]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text, null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) await sendMessage(null, url);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Count unread per conversation
  const getUnreadCount = (convId: string) => {
    if (convId !== activeConversationId) return 0; // Only count for loaded messages
    return messages.filter((m) => m.sender_role === "user" && !m.is_read).length;
  };

  if (loading) {
    return <p className="text-center text-muted-foreground py-8">Memuat chat...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-heading tracking-wider text-foreground mb-6">
        CHAT PELANGGAN
      </h2>

      {conversations.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Belum ada chat dari pelanggan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* Conversation List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Percakapan</p>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left p-3 border-b border-border/50 transition-colors ${
                    activeConversationId === conv.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {userNames[conv.user_id] || "Pelanggan"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(conv.updated_at), "dd MMM, HH:mm", { locale: idLocale })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-card rounded-xl border border-border flex flex-col h-[550px]">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {activeConversationId
                    ? userNames[conversations.find((c) => c.id === activeConversationId)?.user_id || ""] || "Pelanggan"
                    : "Pilih percakapan"}
                </p>
                <p className="text-[10px] text-muted-foreground">Chat pelanggan</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  Belum ada pesan
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                  {m.sender_role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                    m.sender_role === "admin"
                      ? "bg-primary text-secondary"
                      : "bg-muted text-foreground"
                  }`}>
                    {m.image_url && (
                      <img
                        src={m.image_url}
                        alt="Foto"
                        className="max-w-full max-h-48 rounded-lg mb-1 cursor-pointer object-cover"
                        onClick={() => window.open(m.image_url!, "_blank")}
                      />
                    )}
                    {m.content && <p>{m.content}</p>}
                    <p className={`text-[9px] mt-1 ${m.sender_role === "admin" ? "text-secondary/50" : "text-muted-foreground/50"}`}>
                      {format(new Date(m.created_at), "HH:mm")}
                    </p>
                  </div>
                  {m.sender_role === "admin" && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <Shield className="w-3 h-3 text-accent" />
                    </div>
                  )}
                </div>
              ))}
              {uploading && (
                <div className="flex justify-end">
                  <div className="bg-primary/50 text-secondary rounded-xl px-3 py-2 text-sm">
                    Mengunggah foto...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="shrink-0"
                >
                  <Image className="w-4 h-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Balas pesan..."
                  className="flex-1 text-sm"
                  disabled={uploading}
                />
                <Button type="submit" size="icon" variant="hero" disabled={uploading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatTab;
