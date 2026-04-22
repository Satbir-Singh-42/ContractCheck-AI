-- =========================================================================================
-- COMPLETE SUPABASE SCHEMA & RLS SETUP FOR CONTRACTCHECK AI
-- Paste everything below into your Supabase SQL Editor and hit 'Run'
-- =========================================================================================

-- 1. Create core extensions
create extension if not exists "uuid-ossp";

-- =========================================================================================
-- 2. CREATE TABLES
-- =========================================================================================

-- Users table automatically matches the built-in auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Added fields for full user profile support
    avatar_url TEXT,
    organization VARCHAR(255),
    role VARCHAR(255),
    notification_prefs JSONB DEFAULT '{"email": true, "sms": false, "marketing": false}'::jsonb,
    
    -- Billing and tracking
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    uploads_used INTEGER DEFAULT 0,
    uploads_limit INTEGER DEFAULT 3,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'doc', 'txt')),
    file_size_bytes INTEGER,
    contract_type VARCHAR(100),
    parties VARCHAR(500),
    overall_risk VARCHAR(10) CHECK (overall_risk IN ('High', 'Medium', 'Low')),
    compliance_score INTEGER CHECK (compliance_score BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    
    -- Added for public sharing feature
    is_shared BOOLEAN DEFAULT false,
    parent_report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    version_number INTEGER DEFAULT 1,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Clauses table
CREATE TABLE IF NOT EXISTS public.clauses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    original_text TEXT NOT NULL,
    risk_level VARCHAR(20) CHECK (risk_level IN ('Safe', 'Risky', 'Non-compliant')),
    relevant_law VARCHAR(500),
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clause issues
CREATE TABLE IF NOT EXISTS public.clause_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clause_id UUID REFERENCES public.clauses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    order_index INTEGER
);

-- Clause suggestions
CREATE TABLE IF NOT EXISTS public.clause_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clause_id UUID REFERENCES public.clauses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    suggested_text TEXT,
    order_index INTEGER
);


-- =========================================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clause_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clause_suggestions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- Profile Policies
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- -------------------------------------------------------------
-- Report Policies (Private + Public Shared)
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can insert own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can delete own reports" ON public.reports;
DROP POLICY IF EXISTS "Public can view shared reports" ON public.reports;

CREATE POLICY "Users can view own reports" 
ON public.reports FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" 
ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" 
ON public.reports FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" 
ON public.reports FOR DELETE USING (auth.uid() = user_id);

-- PUBLIC SHARING: Anyone can view a report if is_shared is true
CREATE POLICY "Public can view shared reports" 
ON public.reports FOR SELECT USING (is_shared = true);


-- -------------------------------------------------------------
-- Clauses & Sub-tables (Private + Public Shared)
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view clauses of their reports" ON public.clauses;
DROP POLICY IF EXISTS "Public can view clauses of shared reports" ON public.clauses;
DROP POLICY IF EXISTS "Users can view issues of their clauses" ON public.clause_issues;
DROP POLICY IF EXISTS "Public can view issues of shared clauses" ON public.clause_issues;
DROP POLICY IF EXISTS "Users can view suggestions of their clauses" ON public.clause_suggestions;
DROP POLICY IF EXISTS "Public can view suggestions of shared clauses" ON public.clause_suggestions;

CREATE POLICY "Users can view clauses of their reports" 
ON public.clauses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports WHERE reports.id = clauses.report_id AND reports.user_id = auth.uid())
);

CREATE POLICY "Public can view clauses of shared reports" 
ON public.clauses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports WHERE reports.id = clauses.report_id AND reports.is_shared = true)
);

CREATE POLICY "Users can view issues of their clauses" 
ON public.clause_issues FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.clauses JOIN public.reports ON clauses.report_id = reports.id WHERE clause_issues.clause_id = clauses.id AND reports.user_id = auth.uid())
);

CREATE POLICY "Public can view issues of shared clauses" 
ON public.clause_issues FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.clauses 
    JOIN public.reports ON clauses.report_id = reports.id 
    WHERE clause_issues.clause_id = clauses.id AND reports.is_shared = true
  )
);

CREATE POLICY "Users can view suggestions of their clauses" 
ON public.clause_suggestions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.clauses JOIN public.reports ON clauses.report_id = reports.id WHERE clause_suggestions.clause_id = clauses.id AND reports.user_id = auth.uid())
);

CREATE POLICY "Public can view suggestions of shared clauses" 
ON public.clause_suggestions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.clauses 
    JOIN public.reports ON clauses.report_id = reports.id 
    WHERE clause_suggestions.clause_id = clauses.id AND reports.is_shared = true
  )
);


-- =========================================================================================
-- 4. DATABASE TRIGGERS
-- =========================================================================================

-- Trigger automatic profile creation when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- =========================================================================================
-- 5. STORAGE CONFIGURATION HINTS
-- =========================================================================================
-- NOTE: Please ensure you manually create these two buckets in the Supabase Dashboard:
-- 
-- 1. Bucket Name: 'avatars'
--    Public: TRUE
--    Purpose: Storing user profile pictures.
--
-- 2. Bucket Name: 'contracts'
--    Public: FALSE
--    Purpose: High-security storage for uploaded PDF/Docx files awaiting AI analysis.
-- =========================================================================================


-- =========================================================================================
-- 6. STORAGE RLS POLICIES (REQUIRED FOR BUCKET UPLOADS)
-- =========================================================================================
-- Without these policies, uploads fail with:
-- "new row violates row-level security policy"
-- Run this block in Supabase SQL Editor as the project owner role.
DO $$
BEGIN
  -- RLS on storage.objects is managed by Supabase Storage internals.
  -- Avoid forcing ALTER TABLE here, since some roles can create policies
  -- but cannot ALTER storage.objects ownership-level settings.

  -- Remove old versions if this script is re-run
  DROP POLICY IF EXISTS "Public can read avatar files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload avatar files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update avatar files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete avatar files" ON storage.objects;

  DROP POLICY IF EXISTS "Users can read own contract files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload own contract files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own contract files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own contract files" ON storage.objects;

  -- AVATARS BUCKET
  -- Public read for profile images
  CREATE POLICY "Public can read avatar files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

  -- Authenticated users can only manage files inside their own folder: <auth.uid()>/...
  CREATE POLICY "Users can upload avatar files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  CREATE POLICY "Users can update avatar files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  CREATE POLICY "Users can delete avatar files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  -- CONTRACTS BUCKET
  -- Private files: each user can only manage files in their own folder
  CREATE POLICY "Users can read own contract files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  CREATE POLICY "Users can upload own contract files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  CREATE POLICY "Users can update own contract files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  CREATE POLICY "Users can delete own contract files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping storage.objects policy setup due to insufficient privileges. Configure bucket policies manually in Supabase Dashboard > Storage > Policies.';
END
$$;


-- =========================================================================================
-- 7. RPC FUNCTIONS
-- =========================================================================================

-- increment_uploads_used
-- Called by the frontend after every new contract upload.
-- Uses SECURITY DEFINER so it runs as DB owner and bypasses RLS safely.
-- This counter is PERMANENT: it only goes up, never decreases on report delete.
-- This prevents users gaming the free plan by deleting old reports.
CREATE OR REPLACE FUNCTION public.increment_uploads_used(user_id_input UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET uploads_used = uploads_used + 1
  WHERE id = user_id_input;
END;
$$;
