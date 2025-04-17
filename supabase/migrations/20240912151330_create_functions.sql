-- migration: 20240912151330_create_functions.sql
-- description: creates database functions and triggers
-- affected tables: flashcards, generations

-- function to automatically update the updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- trigger to update the updated_at field on flashcards
create trigger update_flashcards_updated_at
before update on flashcards
for each row
execute function update_updated_at();

-- function to check if a youtube url already exists for a user
-- used to prevent duplicate generation requests
create or replace function check_youtube_url_exists(
    p_user_id uuid,
    p_youtube_url text
) returns boolean as $$
declare
    exists_count integer;
begin
    select count(*)
    into exists_count
    from generations
    where user_id = p_user_id
    and source_youtube_url = p_youtube_url;

    return exists_count > 0;
end;
$$ language plpgsql;

-- function to get user flashcard statistics
-- returns total count and breakdowns by source and cefr level
create or replace function get_user_flashcard_stats(
    p_user_id uuid
) returns table (
    total_count bigint,
    by_source json,
    by_cefr_level json
) as $$
begin
    return query
    select
        count(*) as total_count,
        json_object_agg(source, source_count) as by_source,
        json_object_agg(cefr_level, cefr_count) as by_cefr_level
    from (
        select
            source,
            count(*) as source_count
        from
            flashcards
        where
            user_id = p_user_id
        group by
            source
    ) as sources,
    (
        select
            cefr_level,
            count(*) as cefr_count
        from
            flashcards
        where
            user_id = p_user_id
        group by
            cefr_level
    ) as cefr_levels;
end;
$$ language plpgsql; 