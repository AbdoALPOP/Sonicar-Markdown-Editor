/*
  # Create and Configure Storage Bucket

  1. Changes
    - Create storage bucket if it doesn't exist
    - Set up proper bucket configuration
    - Update storage policies
  
  2. Security
    - Enable public access for the bucket
    - Set up proper RLS policies
*/

-- Create the storage bucket if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'markdown-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('markdown-images', 'markdown-images', true);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Own Objects" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Own Objects" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'markdown-images');

CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'markdown-images');

CREATE POLICY "Auth Update Own Objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (bucket_id = 'markdown-images');

CREATE POLICY "Auth Delete Own Objects"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);