-- Ensure the "contracts" bucket exists before running this.
-- If it doesn't, this will insert it programmatically:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Authenticated users can upload to the contracts bucket
-- but ONLY if they are placing it inside a folder named after their own User ID.
CREATE POLICY "Users can upload own contracts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'contracts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can view/download their own uploaded contracts
CREATE POLICY "Users can read own contracts"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'contracts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);
