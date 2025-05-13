-- Migration file: 20250513075323_add_rls_to_existing_tables.sql
-- Purpose: Add Row Level Security (RLS) to existing tables
-- Affected tables: flashcards, generation_error_logs, generations
-- Date: 2025-05-13

-- Enable RLS on flashcards table
alter table "public"."flashcards" enable row level security;

-- Policies for flashcards table
-- Select policy for authenticated users (users can only select their own flashcards)
create policy "users can select their own flashcards"
on "public"."flashcards"
for select
to authenticated
using (auth.uid() = user_id);

-- Insert policy for authenticated users (users can only insert their own flashcards)
create policy "users can insert their own flashcards"
on "public"."flashcards"
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update policy for authenticated users (users can only update their own flashcards)
create policy "users can update their own flashcards"
on "public"."flashcards"
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Delete policy for authenticated users (users can only delete their own flashcards)
create policy "users can delete their own flashcards"
on "public"."flashcards"
for delete
to authenticated
using (auth.uid() = user_id);

-- Enable RLS on generation_error_logs table
alter table "public"."generation_error_logs" enable row level security;

-- Policies for generation_error_logs table
-- Select policy for authenticated users (users can only select their own error logs)
create policy "users can select their own error logs"
on "public"."generation_error_logs"
for select
to authenticated
using (auth.uid() = user_id);

-- Insert policy for authenticated users (users can only insert their own error logs)
create policy "users can insert their own error logs"
on "public"."generation_error_logs"
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update policy for authenticated users (users can only update their own error logs)
create policy "users can update their own error logs"
on "public"."generation_error_logs"
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Delete policy for authenticated users (users can only delete their own error logs)
create policy "users can delete their own error logs"
on "public"."generation_error_logs"
for delete
to authenticated
using (auth.uid() = user_id);

-- Enable RLS on generations table
alter table "public"."generations" enable row level security;

-- Policies for generations table
-- Select policy for authenticated users (users can only select their own generations)
create policy "users can select their own generations"
on "public"."generations"
for select
to authenticated
using (auth.uid() = user_id);

-- Insert policy for authenticated users (users can only insert their own generations)
create policy "users can insert their own generations"
on "public"."generations"
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update policy for authenticated users (users can only update their own generations)
create policy "users can update their own generations"
on "public"."generations"
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Delete policy for authenticated users (users can only delete their own generations)
create policy "users can delete their own generations"
on "public"."generations"
for delete
to authenticated
using (auth.uid() = user_id);

-- Add policies for anon role (optional, commented out)
-- If anonymous users should have access to any data, uncomment and modify these policies

-- Example for flashcards - allowing anonymous users to select data (read-only)
-- create policy "anon can read public flashcards"
-- on "public"."flashcards"
-- for select
-- to anon
-- using (false);  -- By default, we don't allow anon users to see any data, change to specific condition if needed 