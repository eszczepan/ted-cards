# API Endpoint Implementation Plan: POST /api/generations

## 1. Przegląd endpointa

Endpoint służy do uruchomienia procesu generacji propozycji fiszek na podstawie wejściowego tekstu lub linku do filmu YouTube. Umożliwia automatyczne tworzenie fiszek przy pomocy AI. Jego zadaniem jest:

- Walidacja danych wejściowych
- Wywolanie zewnetrznego serwisu AI generującego propozycje fiszek
- Zapisanie metadanych generacji w bazie danych (tabela `generations`)
- Zwrot wygenerowanych propozycji fiszek oraz liczby wygenerowanych pozycji

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /api/generations
- **Parametry:**
  - **Request Body (JSON):**
    - `source_type` (string, wymagane): Jeden z dostępnych typów, tj. "youtube" lub "text".
    - `source_text` (string, wymagane, max 15000 znaków): Tekst źródłowy do analizy.
    - `source_youtube_url` (string, warunkowe): Wymagane, jeśli `source_type` to "youtube", zawiera ważny URL do filmu YouTube.
    - `front_language` (string, wymagane): Język fiszki dla przedniej strony.
    - `back_language` (string, wymagane): Język fiszki dla tylnej strony.

## 3. Wykorzystywane typy

- **DTO Request:**
  - `CreateGenerationCommand` zawierający: `source_type`, `source_text`, `source_youtube_url`, `front_language`, `back_language`.
- **DTO Response (dla procesu tworzenia generacji):**
  - `CreateGenerationResponseDTO` zawierający: `id`, `status` (np. pending, completed, error), `flashcard_proposals` (tablica obiektów typu `FlashcardProposalDTO`), oraz `created_at`.
- **Pozostałe typy pomocnicze:**
  - `FlashcardProposalDTO` – reprezentuje propozycję fiszki wygenerowanej przez AI.
  - `GenerationListResponseDTO` – wykorzystywany przy zwracaniu listy sesji generacji (np. w endpoint GET /api/generations).
- **Command Models / Domain Entities:**
  - Model `Generation` odwzorowujący strukturę tabeli `generations` z bazy danych.

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - Kod 201 Created (lub 202 Accepted, jeżeli generacja odbywa się asynchronicznie).
  - Body: JSON zawierający dane nowo utworzonej sesji generacji:
    ```json
    {
      "id": "uuid",
      "status": "pending | completed | error",
      "flashcard_proposals": [
        {
          /* tymczasowe dane fiszki */
        }
      ],
      "created_at": "timestamp"
    }
    ```
- **Błędy:**
  - 400 Bad Request – dla nieprawidłowych danych wejściowych (np. przekroczenie limitu znaków, niepoprawny URL YouTube).
  - 401 Unauthorized – gdy użytkownik nie jest uwierzytelniony.
  - 500 Internal Server Error – dla błędów po stronie serwera, z jednoczesnym logowaniem błędu w tabeli `generation_error_logs`.

## 5. Przepływ danych

1. Klient wysyła żądanie POST z odpowiednim payloadem.
2. Na serwerze:
   - Weryfikacja autentyczności użytkownika przy użyciu Supabase Auth.
   - Walidacja danych wejściowych za pomocą Zod schema zgodnie z definicjami DTO.
   - Dla `source_type: youtube`, dodatkowa walidacja formatu URL oraz warunku obecności `source_youtube_url`.
3. Wywołanie logiki serwisowej (np. `generation.service`), która:
   - Inicjuje proces generacji fiszek (poprzez integrację z zewnętrznym systemem AI, np. Openrouter.ai).
   - Oblicza statystyki generacji, mierzy czas i liczbę wygenerowanych propozycji.
4. Zapis danych do tabeli `generations` (i ewentualnie do tabeli `flashcards` dla wygenerowanych fiszek).
5. Wysłanie odpowiedzi JSON do klienta.

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie i autoryzacja:** Endpoint dostępny tylko dla zalogowanych użytkowników. Wykorzystanie Supabase Auth oraz mechanizmu RLS w bazie danych.
- **Walidacja danych:** Użycie Zod do sprawdzenia poprawności danych wejściowych, zapobiegające atakom typu injection.
- **Sanityzacja danych:** Upewnienie się, że dane wejściowe są odpowiednio oczyszczone przed przetwarzaniem.
- **Ograniczenia:** Sprawdzanie długości tekstu i poprawności formatu URL, aby uniknąć problemów z przetwarzaniem dużych danych.

## 7. Obsługa błędów

- **Walidacja:** Zwracanie błędu 400 w przypadku nieprawidłowych danych wejściowych.
- **Autoryzacja:** Zwracanie błędu 401, gdy użytkownik nie spełnia wymagań autoryzacyjnych.
- **Błędy przetwarzania:** W przypadku błędów podczas generacji, zwracany jest błąd 500 oraz wpis do tabeli `generation_error_logs` z odpowiednim kodem i opisem błędu.
- **Komunikaty:** Zrozumiałe komunikaty błędów przesyłane do klienta w formacie JSON.

## 8. Rozważania dotyczące wydajności

- Timeout dla wywołania AI to 60 sekund na czas oczekiwania, inaczej błąd timeout.
- Wykorzystanie operacji asynchronicznych do obsługi procesu generacji.
- Optymalizacja zapytań do bazy danych przy użyciu indeksów (zgodnie z planem bazy danych).
- Monitorowanie i skalowanie w razie zwiększonego obciążenia.

## 9. Etapy wdrożenia

1. **Analiza i projektowanie:**
   - Przegląd specyfikacji API, schematu bazy danych oraz definicji typów.
   - Określenie wymagań walidacyjnych zgodnie z Zod i zasadami autoryzacji Supabase.
2. **Implementacja walidacji:**
   - Utworzenie Zod schema oraz DTOs (GenerationRequestDTO i GenerationResponseDTO).
3. **Implementacja logiki serwisowej:**
   - Utworzenie lub rozszerzenie serwisu (np. `generation.service`) do obsługi procesu generacji.
   - Integracja z API AI (np. Openrouter.ai) i obsługa logiki asynchronicznej, na etapie developmentu skorzystamy z mocków zamiast wywoływania serwisu AI.
4. **Integracja z bazą danych:**
   - Zapis nowej sesji generacji w tabeli `generations`.
5. **Obsługa błędów i logowanie:**
   - Implementacja mechanizmu logowania błędów do tabeli `generation_error_logs`.
   - Użycie try-catch i wczesnych zwrotów w przypadku wystąpienia błędów.
6. **Dokumentacja:**
   - Aktualizacja dokumentacji API oraz instrukcji dla zespołu.
7. **Wdrożenie i monitoring:**
   - Wdrożenie endpointu na środowisko deweloperskie i testowe.
