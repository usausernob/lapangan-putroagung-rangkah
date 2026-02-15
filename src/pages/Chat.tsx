import { useState, useRef, useEffect } from "react";
import { Send, Image, Shield, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

const Chat = () => {
  const { user, loading } = useAuth();
  const { messages, sendMessage, uploadImage, markAsRead } = useChat(user?.id, "user");
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Mark admin messages as read
  useEffect(() => {
    if (messages.length > 0) {
      const unreadAdmin = messages
        .filter((m) => m.sender_role === "admin" && !m.is_read)
        .map((m) => m.id);
      markAsRead(unreadAdmin);
    }
  }, [messages, markAsRead]);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4 h-full max-w-3xl">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-heading tracking-wider text-foreground">CHAT ADMIN</h1>
            <p className="text-sm text-muted-foreground">Tanya langsung ke admin GOR Persebaya</p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col h-[calc(100vh-220px)] min-h-[400px]">
            {/* Header */}
            <div className="gradient-hero p-4 rounded-t-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">Admin GOR Persebaya</p>
                <p className="text-[10px] text-primary-foreground/60">Biasanya membalas dalam beberapa menit</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p>Mulai chat dengan admin!</p>
                  <p className="text-xs mt-1">Kirim pesan atau foto untuk bertanya</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.sender_role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.sender_role === "admin" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    m.sender_role === "user"
                      ? "bg-primary text-secondary"
                      : "bg-muted text-foreground"
                  }`}>
                    {m.image_url && (
                      <img
                        src={m.image_url}
                        alt="Foto"
                        className="max-w-full max-h-60 rounded-lg mb-1 cursor-pointer object-cover"
                        onClick={() => window.open(m.image_url!, "_blank")}
                      />
                    )}
                    {m.content && <p>{m.content}</p>}
                    <p className={`text-[9px] mt-1 ${m.sender_role === "user" ? "text-secondary/50" : "text-muted-foreground/50"}`}>
                      {format(new Date(m.created_at), "HH:mm")}
                    </p>
                  </div>
                  {m.sender_role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-accent" />
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
            <div className="p-3 border-t border-border rounded-b-2xl">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
