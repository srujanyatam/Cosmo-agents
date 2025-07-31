
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deployment_logs' AND policyname = 'Users can delete their own deployment logs') THEN
        create policy "Users can delete their own deployment logs"
        on "public"."deployment_logs"
        as permissive
        for delete
        to public
        using ((auth.uid() = user_id));
    END IF;
END $$; 