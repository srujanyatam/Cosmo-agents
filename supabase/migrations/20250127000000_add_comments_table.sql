-- Create comments table for user comments on conversion results
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unreviewed_file_id UUID NOT NULL REFERENCES public.unreviewed_files(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  line_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can view comments on their files') THEN
        CREATE POLICY "Users can view comments on their files" 
        ON public.comments 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.unreviewed_files 
            WHERE id = unreviewed_file_id AND user_id = auth.uid()
          )
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can create comments on their files') THEN
        CREATE POLICY "Users can create comments on their files" 
        ON public.comments 
        FOR INSERT 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.unreviewed_files 
            WHERE id = unreviewed_file_id AND user_id = auth.uid()
          )
        );
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can update their own comments') THEN
        CREATE POLICY "Users can update their own comments" 
        ON public.comments 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can delete their own comments') THEN
        CREATE POLICY "Users can delete their own comments" 
        ON public.comments 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_comments_updated_at') THEN
        CREATE TRIGGER update_comments_updated_at
          BEFORE UPDATE ON public.comments
          FOR EACH ROW
          EXECUTE FUNCTION public.update_comments_updated_at();
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_unreviewed_file_id ON public.comments(unreviewed_file_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at); 