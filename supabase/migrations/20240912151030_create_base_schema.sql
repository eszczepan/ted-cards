-- migration: 20240912151030_create_base_schema.sql
-- description: creates initial database schema for tedcards application
-- tables: flashcards, generations, generation_error_logs

-- create flashcards table
create table flashcards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    front_content text not null check (length(front_content) <= 200),
    back_content text not null check (length(back_content) <= 500),
    front_language text not null,
    back_language text not null,
    cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    source text not null check (source in ('ai_youtube_full', 'ai_youtube_edited', 'ai_text_full', 'ai_text_edited', 'manual')),
    source_youtube_url text,
    status text not null default 'active' check (status in ('active', 'inactive')),
    generation_id uuid,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- create generations table
create table generations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    model text not null,
    generation_duration integer not null,
    generated_count integer not null,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    source_type text not null check (source_type in ('youtube', 'text')),
    source_text_hash text not null,
    source_text_length integer not null,
    source_youtube_url text,
    source_text text not null,
    created_at timestamp with time zone not null default now()
);

-- update flashcards generation_id foreign key reference
alter table flashcards
add constraint flashcards_generation_id_fkey
foreign key (generation_id) references generations(id) on delete set null;

-- create generation_error_logs table
create table generation_error_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    model text,
    source_type text check (source_type in ('youtube', 'text')),
    source_youtube_url text,
    source_text_hash text not null,
    source_text_length integer not null,
    error_code text not null,
    error_message text not null,
    created_at timestamp with time zone not null default now()
);

-- enable row level security on all tables
alter table flashcards enable row level security;
alter table generations enable row level security;
alter table generation_error_logs enable row level security; 