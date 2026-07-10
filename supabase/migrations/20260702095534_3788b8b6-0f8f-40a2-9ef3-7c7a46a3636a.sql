
-- Avatars: user-owned folder
CREATE POLICY "Avatars readable by all authed" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Resource thumbnails: public read for authed, admin write
CREATE POLICY "Thumbnails readable" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'resource-thumbnails');
CREATE POLICY "Admins manage thumbnails" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'resource-thumbnails' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'resource-thumbnails' AND public.has_role(auth.uid(), 'admin'));

-- Blog covers
CREATE POLICY "Blog covers readable" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'blog-covers');
CREATE POLICY "Admins manage blog covers" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'blog-covers' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'blog-covers' AND public.has_role(auth.uid(), 'admin'));

-- Resource files: admin write only; read via signed URLs from server (service role)
CREATE POLICY "Admins manage resource files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'resource-files' AND public.has_role(auth.uid(), 'admin'));
