# Plan implementacji usługi OpenRouter

## 1. Opis usługi

`OpenRouterService` to klasa odpowiedzialna za komunikację z API OpenRouter.ai, które służy jako proxy do różnych modeli LLM (Language Learning Models) takich jak OpenAI, Anthropic czy Google. Usługa ta umożliwia generowanie treści (w przypadku TedCards - fiszek) z wykorzystaniem wybranych modeli językowych, przy jednoczesnej optymalizacji kosztów i kontroli limitów.

Główne funkcjonalności:

- Komunikacja z API OpenRouter
- Wybór odpowiedniego modelu LLM w zależności od zadania
- Zarządzanie kosztami i limitami
- Obsługa błędów i ponawianie nieudanych żądań

## 2. Opis konstruktora

```typescript
interface OpenRouterServiceConfig {
  apiKey: string;
  defaultModel?: string;
  timeout?: number;
  baseUrl?: string;
}

class OpenRouterService {
  constructor(config: OpenRouterServiceConfig) {
    // Inicjalizacja usługi z konfiguracją
  }
}
```

Konstruktor przyjmuje obiekt konfiguracyjny zawierający:

- `apiKey` - klucz API do usługi OpenRouter (wymagany)
- `defaultModel` - domyślny model LLM (opcjonalny)
- `timeout` - limit czasu dla żądań w milisekundach (opcjonalny)
- `baseUrl` - niestandardowy URL bazowy API (opcjonalny)

## 3. Metody

#### `generateFlashcards`

Specjalizowana metoda do generowania fiszek na podstawie przekazanego tekstu

## 4. Obsługa błędów

System powinien wyłapywać konkretne błędy na kadym etapie generowania fiszek

### 4.1 Logowanie błędów

System powinien logować wszystkie błędy z odpowiednimi metadanymi:

- Typ błędu
- Wiadomość błędu
- Timestamp
- ID użytkownika
- Model
- Kontekst żądania (skrócony)

## 5. Kwestie bezpieczeństwa

### 5.1. Bezpieczne przechowywanie kluczy API

- Klucze API nigdy nie powinny być przechowywane w repozytorium kodu
- Wykorzystanie zmiennych środowiskowych

### 5.2. Filtrowanie danych poufnych

- Usuwanie danych poufnych przed wysłaniem zapytań do API
- Nie logowanie pełnych zapytań i odpowiedzi, które mogą zawierać dane poufne

### 5.3. Walidacja danych wejściowych

- Sprawdzanie i oczyszczanie danych wejściowych przed wysłaniem do API
- Implementacja limitów na rozmiar zapytań

### 5.4. Ochrona przed atakami

- Implementacja mechanizmów przeciwdziałających atakom typu prompt injection
- Monitorowanie anomalii w wykorzystaniu API

## 6. Plan wdrożenia krok po kroku

### 6.1. Przygotowanie struktury projektu

```
lib/
  services/
    openrouter.service.ts
```

### 6.2. Definicja typów

Stworzenie pliku `openrouter.types.ts` z wszystkimi interfejsami i typami używanymi przez usługę.

### 6.3. Implementacja utility do liczenia tokenów

Stworzenie pliku `token-counter.ts` z funkcją szacującą liczbę tokenów w tekście.

### 6.5. Implementacja głównej klasy usługi

Stworzenie pliku `openrouter.service.ts` z implementacją klasy `OpenRouterService` zgodnie z opisem w sekcjach 2-3.

### 6.6. Rozszerzenie `GenerationService`

Modyfikacja istniejącej klasy `GenerationService`, aby wykorzystywała `OpenRouterService` zamiast mokowanych danych do generowania fiszek.

### 6.8. Monitorowanie

1. Implementacja monitoringu wykorzystania API i kosztów

## Przykłady wykorzystania

### Przykład 1: Podstawowe użycie do generowania fiszek

```typescript
import { GenerationService } from "./lib/services/generation.service";

async function generateFlashcards() {
  const generationService = new GenerationService();

  const result = await generationService.generateFlashcards("user123", {
    source_type: SOURCE_TYPE.TEXT,
    source_text: "Machine learning is a subset of artificial intelligence...",
    front_language: "en",
    back_language: "pl",
  });

  console.log(`Generated ${result.proposals.length} flashcards in ${result.generationDuration}ms`);
  console.log(result.proposals);
}
```
