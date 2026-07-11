-- ============ STORAGE BUCKETS ============
-- Ensure all required buckets exist.
-- 'resource-thumbnails' is public so getPublicUrl() returns accessible URLs.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',             'avatars',             false, 5242880,   ARRAY['image/*']),
  ('resource-thumbnails', 'resource-thumbnails', true,  10485760,  ARRAY['image/*']),
  ('resource-files',      'resource-files',      false, 524288000, NULL),
  ('blog-covers',         'blog-covers',         true,  10485760,  ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============ PURCHASES: ADD MISSING UPDATE POLICIES ============
-- The server function stores razorpay_order_id after creating the Razorpay order.
-- We now use supabaseAdmin (service role) in server functions, but this policy
-- ensures user-level clients can also update their own pending purchases.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'purchases'
      AND policyname = 'Users update own pending purchases'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users update own pending purchases"
        ON public.purchases
        FOR UPDATE
        USING (auth.uid() = user_id AND status = 'pending')
        WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'purchases'
      AND policyname = 'Admins update all purchases'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins update all purchases"
        ON public.purchases
        FOR UPDATE
        USING (public.has_role(auth.uid(), 'admin'))
        WITH CHECK (public.has_role(auth.uid(), 'admin'))
    $policy$;
  END IF;
END;
$$;
