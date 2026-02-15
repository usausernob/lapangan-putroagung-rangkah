import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Image, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { format } from "date-fns";

const UserChatWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, uploadImage, markAsRead } = useChat(user?.id, "user");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Mark admin messages as read when opening chat
  useEffect(() => {
    if (open && messages.length > 0) {
      const unreadAdmin = messages
        .filter((m) => m.sender_role === "admin" && !m.is_read)
        .map((m) => m.id);
      markAsRead(unreadAdmin);
    }
  }, [open, messages, markAsRead]);

  const unreadCount = messages.filter((m) => m.sender_role === "admin" && !m.is_read).length;

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

  if (!user) return null;

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-hero shadow-lg flex items-center justify-center text-secondary hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-hero p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">Chat Admin</p>
                <p className="text-[10px] text-primary-foreground/60">Tanya langsung ke admin</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                  Mulai chat dengan admin!
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.sender_role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.sender_role === "admin" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Shield className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    m.sender_role === "user"
                      ? "bg-primary text-secondary"
                      : "bg-muted text-foreground"
                  }`}>
                    {m.image_url && (
                      <img
                        src={m.image_url}
                        alt="Foto"
                        className="max-w-full rounded-lg mb-1 cursor-pointer"
                        onClick={() => window.open(m.image_url!, "_blank")}
                      />
                    )}
                    {m.content && <p>{m.content}</p>}
                    <p className={`text-[9px] mt-1 ${m.sender_role === "user" ? "text-secondary/50" : "text-muted-foreground/50"}`}>
                      {format(new Date(m.created_at), "HH:mm")}
                    </p>
                  </div>
                  {m.sender_role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-accent" />
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
                  placeholder="Ketik pesan..."
                  className="flex-1 text-sm"
                  disabled={uploading}
                />
                <Button type="submit" size="icon" variant="hero" disabled={uploading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserChatWidget;
