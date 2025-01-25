/*
  # Fix Storage Policies for Image Upload

  1. Changes
    - Drop existing policies
    - Create new policies with proper security rules
    - Enable RLS for objects table
  
  2. Security
    - Allow public read access to markdown-images bucket
    - Allow authenticated users to upload to markdown-images bucket
*/

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access'
    ) THEN
        DROP POLICY "Public Access" ON storage.objects;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Auth Upload'
    ) THEN
        DROP POLICY "Auth Upload" ON storage.objects;
    END IF;
END $$;

-- Create new policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'markdown-images');

CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'markdown-images'
    AND (storage.foldername(name))[1] != 'private'
);

-- Allow authenticated users to update and delete their own objects
CREATE POLICY "Users can update their own objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (bucket_id = 'markdown-images');

CREATE POLICY "Users can delete their own objects"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);