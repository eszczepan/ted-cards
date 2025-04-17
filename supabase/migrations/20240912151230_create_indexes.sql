-- migration: 20240912151230_create_indexes.sql
-- description: creates indexes for efficient queries
-- affected tables: flashcards, generations, generation_error_logs

-- indexes for flashcards table
-- index on user_id for quick filtering by user
create index idx_flashcards_user_id on flashcards(user_id);

-- index on generation_id for related flashcards lookup
create index idx_flashcards_generation_id on flashcards(generation_id);

-- index on cefr_level for filtering by language proficiency level
create index idx_flashcards_cefr_level on flashcards(cefr_level);

-- index on source for filtering by flashcard source
create index idx_flashcards_source on flashcards(source);

-- index on source_youtube_url for youtube reference lookups
create index idx_flashcards_source_youtube_url on flashcards(source_youtube_url);

-- index on status for quick active/inactive filtering
create index idx_flashcards_status on flashcards(status);

-- index on created_at for chronological sorting
create index idx_flashcards_created_at on flashcards(created_at);

-- indexes for generations table
-- index on user_id for quick filtering by user
create index idx_generations_user_id on generations(user_id);

-- index on source_type for filtering by generation source type
create index idx_generations_source_type on generations(source_type);

-- index on source_youtube_url for youtube reference lookups
create index idx_generations_source_youtube_url on generations(source_youtube_url);

-- index on created_at for chronological sorting
create index idx_generations_created_at on generations(created_at);

-- indexes for generation_error_logs table
-- index on user_id for quick filtering by user
create index idx_generation_error_logs_user_id on generation_error_logs(user_id);

-- index on created_at for chronological sorting
create index idx_generation_error_logs_created_at on generation_error_logs(created_at); 