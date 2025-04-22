# API Endpoint Implementation Plan: Flashcards Creation Endpoint

## 1. Przegląd punktu końcowego

Endpoint umożliwia tworzenie jednej lub wielu fiszek (zarówno ręcznie, jak i wygenerowanych przez AI) na podstawie dostarczonych danych. Fiszki są przypisywane do uwierzytelnionego użytkownika i mogą być opcjonalnie powiązane z sesją generacji (generation_id). Cała operacja korzysta z bazy danych Supabase, a walidacja danych odbywa się przy użyciu Zod.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /api/flashcards
- **Parametry:**
  - **Wymagane:**
    - `flashcards`: Tablica obiektów, z których każdy zawiera:
      - `front_content`: string (maks. 200 znaków)
      - `back_content`: string (maks. 500 znaków)
      - `front_language`: string
      - `back_language`: string
      - `cefr_level`: string (jedna z wartości: A1, A2, B1, B2, C1, C2)
  - **Opcjonalne:**
    - `source`: string (domyślnie `manual`, ewentualnie: `ai_youtube_full`, `ai_youtube_edited`, `ai_text_full`, `ai_text_edited`)
    - `source_youtube_url`: string (wymagane, jeżeli `source` dotyczy YouTube)
    - `generation_id`: string (UUID, opcjonalnie powiązanie z konkretną sesją generacji)
- **Przykład Request Body:**

```json
{
  "flashcards": [
    {
      "front_content": "Example front text",
      "back_content": "Example back text",
      "front_language": "en",
      "back_language": "pl",
      "cefr_level": "B1",
      "source": "manual",
      "source_youtube_url": null
    }
  ],
  "generation_id": "uuid-optional"
}
```

## 3. Wykorzystywane typy

- **DTOs i Command Modele:**
  - `CreateFlashcardDTO`: Definiuje pojedyczną fiszkę do utworzenia.
  - `CreateFlashcardsCommand`: Zawiera tablicę fiszek i opcjonalne `generation_id`.
  - `CreateFlashcardsResponseDTO`: Odpowiedź zawierająca pola `success`, `created_count` oraz listę utworzonych fiszek (używając `FlashcardDTO`).

## 4. Szczegóły odpowiedzi

- **Struktura odpowiedzi:**

```json
{
  "success": true,
  "created_count": number,
  "flashcards": [
    {
      "id": "uuid",
      "front_content": "string",
      "back_content": "string",
      "front_language": "string",
      "back_language": "string",
      "cefr_level": "string",
      "source": "string",
      "source_youtube_url": "string",
      "generation_id": "uuid",
      "status": "active/inactive",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

- **Kody statusu:**
  - 201 Created – Fiszki utworzono pomyślnie.
  - 400 Bad Request – Błędne dane wejściowe.
  - 401 Unauthorized – Nieautoryzowany dostęp.
  - 500 Internal Server Error – Błąd po stronie serwera.

## 5. Przepływ danych

1. Odbiór żądania POST z danymi fiszek.
2. Walidacja danych wejściowych przy użyciu Zod, zgodnie z limitami określonymi w specyfikacji oraz w bazie danych.
3. Weryfikacja tożsamości użytkownika poprzez middleware Supabase.
4. Przekazanie zweryfikowanych danych do warstwy flashcards.service, odpowiedzialnej za logikę biznesową.
5. Wstawienie danych do tabeli `flashcards` w bazie danych, z uwzględnieniem ograniczeń (takich jak długość tekstów).
6. Opcjonalne powiązanie fiszek z `generation_id`, jeżeli został on dostarczony.
7. Zwrócenie odpowiedzi w formacie `CreateFlashcardsResponseDTO` z kodem 201.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Wykorzystanie middleware Supabase dla weryfikacji użytkownika.
- **Autoryzacja:** Operacja dotyczy jedynie danych zalogowanego użytkownika.
- **Walidacja danych:** Użycie Zod do ścisłej walidacji, zabezpieczając się przed przekroczeniem limitów i niepoprawnymi wartościami.
- **Sanitization:** Oczyszczanie danych wejściowych w celu zapobiegania atakom SQL Injection i XSS.

## 7. Obsługa błędów

- **400 Bad Request:** W przypadku błędów walidacji danych wejściowych.
- **401 Unauthorized:** Gdy użytkownik nie jest uwierzytelniony.
- **500 Internal Server Error:** Dla nieoczekiwanych błędów systemowych.
- Rejestrowanie błędów (np. do tabeli `GenerationErrorLog`) w celu analizy i monitorowania problemów.
- Zapewnienie przejrzystych komunikatów błędów oraz odpowiednich kodów statusu.

## 8. Rozważania dotyczące wydajności

- Wykorzystanie operacji wsadowych przy tworzeniu wielu fiszek jednocześnie.
- Optymalizacja liczby zapytań do bazy danych przez łączenie operacji.
- Stosowanie indeksów (np. na `user_id` i `generation_id`) dla szybkich operacji wyszukiwania.

## 9. Etapy wdrożenia

1. Utworzenie lub aktualizacja endpointu `/api/flashcards` w ramach Next.js (App Router).
2. Implementacja middleware uwierzytelniającego użytkownika (Supabase Auth).
3. Zdefiniowanie schematów walidacyjnych z wykorzystaniem Zod dla `CreateFlashcardDTO` i `CreateFlashcardsCommand`.
4. Utworzenie warstwy flashcards.service odpowiedzialnej za logikę biznesową oraz operacje na bazie danych.
5. Integracja z bazą danych Supabase, w tym obsługa operacji wsadowych i przestrzeganie ograniczeń zdefiniowanych w schemacie bazy danych.
6. Implementacja mechanizmu logowania błędów, który zapisuje wyjątki do tabeli `GenerationErrorLog`.
