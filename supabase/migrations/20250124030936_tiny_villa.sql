/*
  # Create Storage Bucket for Markdown Images

  1. New Storage Bucket
    - Creates a new public bucket for storing markdown images
    - Enables public access to the stored images
    
  2. Security
    - Enables public access for reading images
    - Restricts upload capabilities to authenticated users only
*/

-- Create a new storage bucket for markdown images
INSERT INTO storage.buckets (id, name, public)
VALUES ('markdown-images', 'markdown-images', true);

-- Set up security policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'markdown-images');

CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'markdown-images');