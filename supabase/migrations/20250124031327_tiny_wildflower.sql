/*
  # Fix Storage and Authentication Setup

  1. Changes
    - Create anonymous user
    - Update storage policies
    - Enable RLS
  
  2. Security
    - Allow public read access
    - Allow authenticated uploads
    - Restrict private folder access
*/

-- First, create an anonymous user if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'anonymous@example.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'anonymous@example.com',
      crypt('anonymous123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
  ) THEN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own objects" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own objects" ON storage.objects;
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

CREATE POLICY "Auth Update Own Objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (bucket_id = 'markdown-images');

CREATE POLICY "Auth Delete Own Objects"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);