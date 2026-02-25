
-- 1. Recreate the missing trigger for handle_new_user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Fix ALL restrictive policies → permissive for chat_messages
DROP POLICY IF EXISTS "Admins can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update own messages read status" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;

CREATE POLICY "Admins can view all messages" ON public.chat_messages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid()));
CREATE POLICY "Admins can send messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND sender_role = 'admin' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can send messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND sender_role = 'user' AND EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid()));
CREATE POLICY "Admins can update messages" ON public.chat_messages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own messages read status" ON public.chat_messages FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM chat_conversations WHERE chat_conversations.id = chat_messages.conversation_id AND chat_conversations.user_id = auth.uid()));

-- 3. Fix chat_conversations policies
DROP POLICY IF EXISTS "Admins can update conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can create own conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversation timestamp" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON public.chat_conversations;

CREATE POLICY "Admins can view all conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own conversations" ON public.chat_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own conversation" ON public.chat_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update conversations" ON public.chat_conversations FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own conversation timestamp" ON public.chat_conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Fix bookings policies
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Fix profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 6. Fix user_roles policies
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 7. Fix gallery_images policies
DROP POLICY IF EXISTS "Admins can delete gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;

CREATE POLICY "Anyone can view gallery images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery images" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update gallery images" ON public.gallery_images FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete gallery images" ON public.gallery_images FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Fix existing user who registered without trigger - create missing profile & role
INSERT INTO public.profiles (user_id, full_name)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'User')
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::app_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT DO NOTHING;
