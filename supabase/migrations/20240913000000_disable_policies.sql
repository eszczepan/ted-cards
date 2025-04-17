-- migration: 20240913000000_disable_policies.sql
-- description: disables all row level security policies for flashcards, generations, and generation_error_logs tables

-- drop policies for flashcards table
drop policy if exists "authenticated users can view their own flashcards" on flashcards;
drop policy if exists "authenticated users can insert their own flashcards" on flashcards;
drop policy if exists "authenticated users can update their own flashcards" on flashcards;
drop policy if exists "authenticated users can delete their own flashcards" on flashcards;

-- drop policies for generations table
drop policy if exists "authenticated users can view their own generations" on generations;
drop policy if exists "authenticated users can insert their own generations" on generations;
drop policy if exists "authenticated users can update their own generations" on generations;
drop policy if exists "authenticated users can delete their own generations" on generations;

-- drop policies for generation_error_logs table
drop policy if exists "authenticated users can view their own error logs" on generation_error_logs;
drop policy if exists "authenticated users can insert their own error logs" on generation_error_logs;
drop policy if exists "authenticated users can delete their own error logs" on generation_error_logs;
drop policy if exists "authenticated users can update their own error logs" on generation_error_logs;

-- disable row level security on all tables
alter table flashcards disable row level security;
alter table generations disable row level security;
alter table generation_error_logs disable row level security; 