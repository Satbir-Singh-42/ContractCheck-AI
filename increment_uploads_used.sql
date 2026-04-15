-- ══════════════════════════════════════════════════════════════
-- Run this in your Supabase SQL Editor
-- This creates a secure server-side function to increment
-- uploads_used. Using a function prevents race conditions
-- and ensures the counter is never tampered with client-side.
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION increment_uploads_used(user_id_input UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as DB owner, bypasses RLS safely
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET uploads_used = uploads_used + 1
  WHERE id = user_id_input;
END;
$$;
