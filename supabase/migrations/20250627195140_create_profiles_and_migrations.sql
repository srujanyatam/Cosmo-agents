
-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create migrations table to track user migrations
CREATE TABLE IF NOT EXISTS public.migrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  folder_structure JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create files table to track individual files and their conversion status
CREATE TABLE IF NOT EXISTS public.migration_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  migration_id UUID NOT NULL REFERENCES public.migrations(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('table', 'procedure', 'trigger', 'other')),
  original_content TEXT,
  converted_content TEXT,
  conversion_status TEXT NOT NULL DEFAULT 'pending' CHECK (conversion_status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" 
          ON public.profiles 
          FOR SELECT 
          USING (auth.uid() = id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" 
          ON public.profiles 
          FOR UPDATE 
          USING (auth.uid() = id);
    END IF;
END $$;

-- Create RLS policies for migrations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migrations' AND policyname = 'Users can view their own migrations') THEN
        CREATE POLICY "Users can view their own migrations" 
          ON public.migrations 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migrations' AND policyname = 'Users can create their own migrations') THEN
        CREATE POLICY "Users can create their own migrations" 
          ON public.migrations 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migrations' AND policyname = 'Users can update their own migrations') THEN
        CREATE POLICY "Users can update their own migrations" 
          ON public.migrations 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migrations' AND policyname = 'Users can delete their own migrations') THEN
        CREATE POLICY "Users can delete their own migrations" 
          ON public.migrations 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create RLS policies for migration_files
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migration_files' AND policyname = 'Users can view their own migration files') THEN
        CREATE POLICY "Users can view their own migration files" 
          ON public.migration_files 
          FOR SELECT 
          USING (auth.uid() = (SELECT user_id FROM public.migrations WHERE id = migration_id));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migration_files' AND policyname = 'Users can create their own migration files') THEN
        CREATE POLICY "Users can create their own migration files" 
          ON public.migration_files 
          FOR INSERT 
          WITH CHECK (auth.uid() = (SELECT user_id FROM public.migrations WHERE id = migration_id));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migration_files' AND policyname = 'Users can update their own migration files') THEN
        CREATE POLICY "Users can update their own migration files" 
          ON public.migration_files 
          FOR UPDATE 
          USING (auth.uid() = (SELECT user_id FROM public.migrations WHERE id = migration_id));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'migration_files' AND policyname = 'Users can delete their own migration files') THEN
        CREATE POLICY "Users can delete their own migration files" 
          ON public.migration_files 
          FOR DELETE 
          USING (auth.uid() = (SELECT user_id FROM public.migrations WHERE id = migration_id));
    END IF;
END $$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    END IF;
END $$;

-- Enable realtime for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.migrations REPLICA IDENTITY FULL;
ALTER TABLE public.migration_files REPLICA IDENTITY FULL;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profiles') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'migrations') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.migrations;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'migration_files') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.migration_files;
    END IF;
END $$;
