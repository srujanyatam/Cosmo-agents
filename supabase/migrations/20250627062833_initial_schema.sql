
-- Create a table for deployment logs
create table if not exists "public"."deployment_logs" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "status" text,
    "lines_of_sql" integer,
    "file_count" integer,
    "error_message" text
);

alter table "public"."deployment_logs" enable row level security;

-- Create policy that allows users to view their own deployment logs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deployment_logs' AND policyname = 'Users can view their own deployment logs') THEN
        create policy "Users can view their own deployment logs"
        on "public"."deployment_logs"
        as permissive
        for select
        to public
        using ((auth.uid() = user_id));
    END IF;
END $$;

-- Create policy that allows users to insert their own deployment logs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deployment_logs' AND policyname = 'Users can insert their own deployment logs') THEN
        create policy "Users can insert their own deployment logs"
        on "public"."deployment_logs"
        as permissive
        for insert
        to public
        with check ((auth.uid() = user_id));
    END IF;
END $$;

-- Enable realtime for automatic updates
ALTER TABLE public.deployment_logs REPLICA IDENTITY FULL;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'deployment_logs') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.deployment_logs;
    END IF;
END $$;
