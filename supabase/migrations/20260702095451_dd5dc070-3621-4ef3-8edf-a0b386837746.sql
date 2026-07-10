
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Public can submit contact" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (length(name) > 0 AND length(email) > 0 AND length(message) > 0 AND length(message) < 5000);

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (length(email) > 3 AND email LIKE '%@%');
