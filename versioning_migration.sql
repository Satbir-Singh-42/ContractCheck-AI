-- Execute this in the Supabase SQL Editor
ALTER TABLE reports ADD COLUMN parent_report_id UUID REFERENCES reports(id) ON DELETE CASCADE;
ALTER TABLE reports ADD COLUMN version_number INTEGER DEFAULT 1;

-- Update RLS policies to make sure they implicitly cover versioned reports.
-- Since the existing policies cover all reports by user_id, no RLS updates are explicitly required.
