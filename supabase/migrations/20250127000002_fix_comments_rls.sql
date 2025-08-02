-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own comments" ON public.conversion_comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.conversion_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.conversion_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.conversion_comments;
DROP POLICY IF EXISTS "Users can view comments on their files or public comments" ON public.conversion_comments;

-- Enable Row Level Security
ALTER TABLE public.conversion_comments ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "Users can view their own comments" ON public.conversion_comments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comments" ON public.conversion_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.conversion_comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.conversion_comments
FOR DELETE USING (auth.uid() = user_id); 