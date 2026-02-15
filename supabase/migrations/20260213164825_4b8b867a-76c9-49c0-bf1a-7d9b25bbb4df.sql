
-- Chat conversations table (one per user)
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Users can view/create their own conversation
CREATE POLICY "Users can view own conversations" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversation" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations" ON public.chat_conversations
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'user' CHECK (sender_role IN ('user', 'admin')),
  content TEXT,
  image_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their own conversations
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

-- Users can insert messages in their own conversations
CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    sender_role = 'user' AND
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages" ON public.chat_messages
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can send messages (as admin role)
CREATE POLICY "Admins can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    sender_role = 'admin' AND
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Admins can update messages (mark as read)
CREATE POLICY "Admins can update messages" ON public.chat_messages
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can update messages (mark as read for admin replies)
CREATE POLICY "Users can update own messages read status" ON public.chat_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
  );

-- Updated_at trigger for conversations
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Storage bucket for chat images
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-images', 'chat-images', true);

-- Storage policies for chat images
CREATE POLICY "Authenticated users can upload chat images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view chat images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-images');
