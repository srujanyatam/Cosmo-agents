-- Enable Row Level Security on conversion_comments table
ALTER TABLE public.conversion_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
DO $$ 
BEGIN
    -- Users can view their own comments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversion_comments' AND policyname = 'Users can view their own comments') THEN
        CREATE POLICY "Users can view their own comments" ON public.conversion_comments
        FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Users can insert their own comments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversion_comments' AND policyname = 'Users can insert their own comments') THEN
        CREATE POLICY "Users can insert their own comments" ON public.conversion_comments
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Users can update their own comments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversion_comments' AND policyname = 'Users can update their own comments') THEN
        CREATE POLICY "Users can update their own comments" ON public.conversion_comments
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Users can delete their own comments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversion_comments' AND policyname = 'Users can delete their own comments') THEN
        CREATE POLICY "Users can delete their own comments" ON public.conversion_comments
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$; 