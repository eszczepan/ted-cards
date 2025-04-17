-- migration: 20240912151130_create_rls_policies.sql
-- description: creates row level security policies for all tables
-- affected tables: flashcards, generations, generation_error_logs

-- rls policies for flashcards table
-- policy for authenticated users to select only their own flashcards
create policy "authenticated users can view their own flashcards"
on flashcards for select
to authenticated
using (auth.uid() = user_id);

-- policy for authenticated users to insert only their own flashcards
create policy "authenticated users can insert their own flashcards"
on flashcards for insert
to authenticated
with check (auth.uid() = user_id);

-- policy for authenticated users to update only their own flashcards
create policy "authenticated users can update their own flashcards"
on flashcards for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- policy for authenticated users to delete only their own flashcards
create policy "authenticated users can delete their own flashcards"
on flashcards for delete
to authenticated
using (auth.uid() = user_id);

-- rls policies for generations table
-- policy for authenticated users to select only their own generations
create policy "authenticated users can view their own generations"
on generations for select
to authenticated
using (auth.uid() = user_id);

-- policy for authenticated users to insert only their own generations
create policy "authenticated users can insert their own generations"
on generations for insert
to authenticated
with check (auth.uid() = user_id);

-- policy for authenticated users to update only their own generations
create policy "authenticated users can update their own generations"
on generations for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- policy for authenticated users to delete only their own generations
create policy "authenticated users can delete their own generations"
on generations for delete
to authenticated
using (auth.uid() = user_id);

-- rls policies for generation_error_logs table
-- policy for authenticated users to select only their own error logs
create policy "authenticated users can view their own error logs"
on generation_error_logs for select
to authenticated
using (auth.uid() = user_id);

-- policy for authenticated users to insert only their own error logs
create policy "authenticated users can insert their own error logs"
on generation_error_logs for insert
to authenticated
with check (auth.uid() = user_id);

-- policy for authenticated users to update only their own error logs
create policy "authenticated users can update their own error logs"
on generation_error_logs for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- policy for authenticated users to delete only their own error logs
create policy "authenticated users can delete their own error logs"
on generation_error_logs for delete
to authenticated
using (auth.uid() = user_id); 