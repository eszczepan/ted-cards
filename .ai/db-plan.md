# Schemat bazy danych PostgreSQL dla aplikacji TedCards

## 1. Tabele

### 1.1 users (zarządzana przez Supabase Auth)

| Kolumna            | Typ                      | Ograniczenia            | Opis                               |
| ------------------ | ------------------------ | ----------------------- | ---------------------------------- |
| id                 | uuid                     | PRIMARY KEY             | Unikalny identyfikator użytkownika |
| email              | text                     | NOT NULL, UNIQUE        | Adres email użytkownika            |
| encrypted_password | text                     | NOT NULL                | Zaszyfrowane hasło użytkownika     |
| created_at         | timestamp with time zone | NOT NULL, DEFAULT now() | Data utworzenia konta              |
| confirmed_at       | timestamp with time zone | NOT NULL, DEFAULT now() | Data potwierdzenia adresu konta    |

### 1.2 flashcards

| Kolumna            | Typ                      | Ograniczenia                                                                                                     | Opis                                              |
| ------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| id                 | uuid                     | PRIMARY KEY, BIGSERIAL                                                                                           | Unikalny identyfikator fiszki                     |
| user_id            | uuid                     | NOT NULL, REFERENCES users(id) ON DELETE CASCADE                                                                 | Identyfikator właściciela fiszki                  |
| front_content      | text                     | NOT NULL, CHECK (length(front_content) <= 200)                                                                   | Zawartość przedniej strony fiszki (do 200 znaków) |
| back_content       | text                     | NOT NULL, CHECK (length(back_content) <= 500)                                                                    | Zawartość tylnej strony fiszki (do 500 znaków)    |
| front_language     | text                     | NOT NULL                                                                                                         | Język przedniej strony fiszki                     |
| back_language      | text                     | NOT NULL                                                                                                         | Język tylnej strony fiszki                        |
| cefr_level         | text                     | NOT NULL, CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'))                                             | Poziom zaawansowania według CEFR                  |
| source             | text                     | NOT NULL, CHECK (source IN ('ai_youtube_full', 'ai_youtube_edited', 'ai_text_full', 'ai_text_edited', 'manual')) | Źródło pochodzenia fiszki                         |
| source_youtube_url | text                     | NULLABLE                                                                                                         | Link do filmu YouTube (jeśli dotyczy)             |
| status             | text                     | NOT NULL, DEFAULT 'active', CHECK (status IN ('active', 'inactive'))                                             | Status aktywności fiszki                          |
| generation_id      | uuid                     | REFERENCES generations(id) ON DELETE SET NULL                                                                    | Powiązanie z sesją generacji                      |
| created_at         | timestamp with time zone | NOT NULL, DEFAULT now()                                                                                          | Data utworzenia fiszki                            |
| updated_at         | timestamp with time zone | NOT NULL, DEFAULT now()                                                                                          | Data ostatniej aktualizacji fiszki                |

### 1.3 generations

| Kolumna                 | Typ                      | Ograniczenia                                         | Opis                                     |
| ----------------------- | ------------------------ | ---------------------------------------------------- | ---------------------------------------- |
| id                      | uuid                     | PRIMARY KEY, BIGSERIAL                               | Unikalny identyfikator sesji generacji   |
| user_id                 | uuid                     | NOT NULL, REFERENCES users(id) ON DELETE CASCADE     | Identyfikator użytkownika                |
| model                   | text                     | NOT NULL                                             | Model AI użyty do generacji              |
| generation_duration     | integer                  | NOT NULL                                             | Całkowity czas generacji                 |
| generated_count         | integer                  | NOT NULL                                             | Liczba wygenerowanych fiszek             |
| accepted_unedited_count | integer                  | NULLABLE                                             | Liczba zaakceptowanych fiszek bez edycji |
| accepted_edited_count   | integer                  | NULLABLE                                             | Liczba zaakceptowanych fiszek po edycji  |
| source_type             | text                     | NOT NULL, CHECK (source_type IN ('youtube', 'text')) | Typ źródła                               |
| source_text_hash        | text                     | NOT NULL                                             | Hash tekstu źródłowego                   |
| source_text_length      | integer                  | NOT NULL                                             | Długość tekstu źródłowego                |
| source_youtube_url      | text                     | NULLABLE                                             | Link do filmu YouTube (jeśli dotyczy)    |
| source_text             | text                     | NOT NULL                                             | Tekst źródłowy (do 15000 znaków)         |
| created_at              | timestamp with time zone | NOT NULL, DEFAULT now()                              | Data utworzenia rekordu                  |

### 1.4 generation_error_logs

| Kolumna            | Typ                      | Ograniczenia                                     | Opis                                  |
| ------------------ | ------------------------ | ------------------------------------------------ | ------------------------------------- |
| id                 | uuid                     | PRIMARY KEY, BIGSERIAL                           | Unikalny identyfikator logu błędu     |
| user_id            | uuid                     | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Identyfikator użytkownika             |
| model              | text                     | NULLABLE                                         | Model AI użyty do generacji           |
| source_type        | text                     | CHECK (source_type IN ('youtube', 'text'))       | Typ źródła                            |
| source_youtube_url | text                     | NULLABLE                                         | Link do filmu YouTube (jeśli dotyczy) |
| source_text_hash   | text                     | NOT NULL                                         | Hash tekstu źródłowego                |
| source_text_length | integer                  | NOT NULL                                         | Długość tekstu źródłowego             |
| error_code         | text                     | NOT NULL                                         | Kod błędu                             |
| error_message      | text                     | NOT NULL                                         | Wiadomość błędu                       |
| created_at         | timestamp with time zone | NOT NULL, DEFAULT now()                          | Data utworzenia rekordu               |

## 2. Relacje między tabelami

1. `users` 1:N `flashcards` - Jeden użytkownik może mieć wiele fiszek
2. `users` 1:N `generations` - Jeden użytkownik może mieć wiele sesji generacji
3. `users` 1:N `generation_error_logs` - Jeden użytkownik może mieć wiele logów błędów
4. `generations` 1:N `flashcards` - Jedna sesja generacji może utworzyć wiele fiszek

## 3. Indeksy

```sql
-- Indeksy dla tabeli flashcards
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_generation_id ON flashcards(generation_id);
CREATE INDEX idx_flashcards_cefr_level ON flashcards(cefr_level);
CREATE INDEX idx_flashcards_source ON flashcards(source);
CREATE INDEX idx_flashcards_source_youtube_url ON flashcards(source_youtube_url);
CREATE INDEX idx_flashcards_status ON flashcards(status);
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);

-- Indeksy dla tabeli generations
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_source_type ON generations(source_type);
CREATE INDEX idx_generations_source_youtube_url ON generations(source_youtube_url);
CREATE INDEX idx_generations_created_at ON generations(created_at);

-- Indeksy dla tabeli generation_error_logs
CREATE INDEX idx_generation_error_logs_user_id ON generation_error_logs(user_id);
CREATE INDEX idx_generation_error_logs_created_at ON generation_error_logs(created_at);
```

## 4. Zasady Row Level Security (RLS)

```sql
-- Włączenie RLS dla tabeli flashcards
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Polityka dla tabeli flashcards - tylko właściciel może widzieć i modyfikować swoje fiszki
CREATE POLICY flashcards_policy ON flashcards
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Włączenie RLS dla tabeli generations
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Polityka dla tabeli generations - tylko właściciel może widzieć i modyfikować swoje sesje generacji
CREATE POLICY generations_policy ON generations
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Włączenie RLS dla tabeli generation_error_logs
ALTER TABLE generation_error_logs ENABLE ROW LEVEL SECURITY;

-- Polityka dla tabeli generation_error_logs - tylko właściciel może widzieć swoje logi błędów
CREATE POLICY generation_error_logs_policy ON generation_error_logs
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

## 5. Triggery i funkcje

```sql
-- Funkcja automatycznie aktualizująca pole updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla tabeli flashcards
CREATE TRIGGER update_flashcards_updated_at
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Funkcja sprawdzająca duplikaty URL YouTube
CREATE OR REPLACE FUNCTION check_youtube_url_exists(
    p_user_id uuid,
    p_youtube_url text
) RETURNS boolean AS $$
DECLARE
    exists_count integer;
BEGIN
    SELECT COUNT(*)
    INTO exists_count
    FROM generations
    WHERE user_id = p_user_id
    AND source_youtube_url = p_youtube_url;

    RETURN exists_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Funkcja licząca statystyki fiszek użytkownika
CREATE OR REPLACE FUNCTION get_user_flashcard_stats(
    p_user_id uuid
) RETURNS TABLE (
    total_count bigint,
    by_source json,
    by_cefr_level json
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) AS total_count,
        json_object_agg(source, source_count) AS by_source,
        json_object_agg(cefr_level, cefr_count) AS by_cefr_level
    FROM (
        SELECT
            source,
            COUNT(*) AS source_count
        FROM
            flashcards
        WHERE
            user_id = p_user_id
        GROUP BY
            source
    ) AS sources,
    (
        SELECT
            cefr_level,
            COUNT(*) AS cefr_count
        FROM
            flashcards
        WHERE
            user_id = p_user_id
        GROUP BY
            cefr_level
    ) AS cefr_levels;
END;
$$ LANGUAGE plpgsql;
```

## 6. Uwagi dodatkowe

- Pamiętaj zeby tabele tworzyć w poprawnej kolejności
- Triggery automatycznie aktualizują pola updated_at przy zmianach rekordów.
