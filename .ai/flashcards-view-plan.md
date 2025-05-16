# Plan implementacji widoku "Moje fiszki"

## 1. Przegląd

Widok "Moje fiszki" umożliwia użytkownikowi przeglądanie wszystkich jego zaakceptowanych fiszek, wyszukiwanie fiszek, sortowanie ich według różnych kryteriów, filtrowanie po poziomie CEFR oraz wykonywanie operacji edycji i usuwania. Jest to kluczowy widok do zarządzania kolekcją fiszek użytkownika.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką: `/flashcards`. PAMIĘTAJ ŻE TO MA BYĆ `/flashcards` A NIE `/dashboard/flashcards`

## 3. Struktura komponentów

```
FlashcardsPageLayout
├── FlashcardsHeader
├── FlashcardsToolbar
│   ├── FlashcardsSearchBar
│   └── FlashcardsFilterBar
├── FlashcardsList
│   ├── FlashcardItem[]
│   └── Pagination
├── FlashcardEditModal (conditional)
└── FlashcardDeleteModal (conditional)
```

## 4. Szczegóły komponentów

### FlashcardsPageLayout

- **Opis**: Główny komponent strony zawierający wszystkie elementy widoku fiszek.
- **Główne elementy**: Nagłówek strony, pasek narzędzi z wyszukiwarką i filtrami, lista fiszek, modalne okna edycji i usuwania.
- **Obsługiwane interakcje**: Zarządzanie stanem globalnym widoku, przekazywanie propsów do komponentów potomnych.
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardListResponseDTO`, `FlashcardsPageParams`
- **Propsy**: N/A (komponent najwyższego poziomu)

### FlashcardsHeader

- **Opis**: Nagłówek strony z tytułem "Moje fiszki".
- **Główne elementy**: Tytuł, ewentualnie liczba fiszek.
- **Obsługiwane interakcje**: N/A
- **Obsługiwana walidacja**: N/A
- **Typy**: N/A
- **Propsy**: `{ totalFlashcards?: number }`

### FlashcardsToolbar

- **Opis**: Pasek narzędzi zawierający wyszukiwarkę i filtry.
- **Główne elementy**: `FlashcardsSearchBar`, `FlashcardsFilterBar`
- **Obsługiwane interakcje**: Koordynacja stanu wyszukiwania i filtrowania.
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardSearchParams`, `FlashcardFilterParams`
- **Propsy**: `{ onSearchChange: (term: string) => void, onFilterChange: (filters: FlashcardFilterParams) => void }`

### FlashcardsSearchBar

- **Opis**: Komponent wyszukiwarki fiszek.
- **Główne elementy**: Pole tekstowe, przycisk wyszukiwania, ewentualnie przycisk czyszczenia.
- **Obsługiwane interakcje**: Wprowadzanie tekstu, wysyłanie formularza, czyszczenie wyszukiwania.
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardSearchParams`
- **Propsy**: `{ searchTerm: string, onSearchChange: (term: string) => void }`

### FlashcardsFilterBar

- **Opis**: Komponent do filtrowania i sortowania fiszek.
- **Główne elementy**: Dropdown do wyboru poziomu CEFR, dropdown sortowania, przyciski resetowania filtrów.
- **Obsługiwane interakcje**: Zmiana filtrów, resetowanie filtrów.
- **Obsługiwana walidacja**: Zgodność z typami `CefrLevel`, `FlashcardStatus`, `FlashcardSource`.
- **Typy**: `FlashcardFilterParams`, `CefrLevel`, `FlashcardStatus`, `FlashcardSource`
- **Propsy**: `{ filters: FlashcardFilterParams, onFilterChange: (filters: FlashcardFilterParams) => void }`

### FlashcardsList

- **Opis**: Komponent wyświetlający listę fiszek.
- **Główne elementy**: Lista `FlashcardItem`, komponent `Pagination`.
- **Obsługiwane interakcje**: Kliknięcie w fiszkę, zmiana strony.
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardDTO[]`, `PaginationDTO`
- **Propsy**: `{ flashcards: FlashcardDTO[], pagination: PaginationDTO, isLoading: boolean, onPageChange: (page: number) => void, onEditFlashcard: (flashcard: FlashcardDTO) => void, onDeleteFlashcard: (flashcard: FlashcardDTO) => void }`

### FlashcardItem

- **Opis**: Komponent reprezentujący pojedynczą fiszkę na liście.
- **Główne elementy**: Karty fiszek z treścią (przód/tył), oznaczenie poziomu CEFR, przyciski akcji (edycja, usunięcie).
- **Obsługiwane interakcje**: Wyświetlenie szczegółów, przejście do edycji, inicjacja usunięcia.
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardDTO`
- **Propsy**: `{ flashcard: FlashcardDTO, onEdit: (flashcard: FlashcardDTO) => void, onDelete: (flashcard: FlashcardDTO) => void }`

### Pagination

- **Opis**: Komponent do nawigacji po stronach listy fiszek.
- **Główne elementy**: Przyciski do zmiany strony, informacja o aktualnej stronie.
- **Obsługiwane interakcje**: Zmiana strony, wybór liczby elementów na stronę.
- **Obsługiwana walidacja**: Wartości paginacji muszą być dodatnimi liczbami całkowitymi.
- **Typy**: `PaginationDTO`
- **Propsy**: `{ pagination: PaginationDTO, onPageChange: (page: number) => void }`

### FlashcardEditModal

- **Opis**: Modal do edycji fiszki.
- **Główne elementy**: Formularz z polami do edycji, przyciski potwierdzenia i anulowania.
- **Obsługiwane interakcje**: Edycja pól, zapisanie zmian, anulowanie edycji.
- **Obsługiwana walidacja**: Długość pól (front_content: max 200 znaków, back_content: max 500 znaków).
- **Typy**: `FlashcardDTO`, `UpdateFlashcardDTO`
- **Propsy**: `{ isOpen: boolean, flashcard: FlashcardDTO | null, onClose: () => void, onSave: (id: string, data: UpdateFlashcardDTO) => Promise<void> }`

### FlashcardDeleteModal

- **Opis**: Modal potwierdzający usunięcie fiszki.
- **Główne elementy**: Tekst potwierdzenia, przyciski potwierdzenia i anulowania.
- **Obsługiwane interakcje**: Potwierdzenie usunięcia, anulowanie.
- **Obsługiwana walidacja**: N/A
- **Typy**: `FlashcardDTO`
- **Propsy**: `{ isOpen: boolean, flashcard: FlashcardDTO | null, onClose: () => void, onConfirm: (id: string) => Promise<void> }`

## 5. Typy

### Typy pochodzące z API:

```typescript
// Istniejące typy z types/index.ts
import { FlashcardDTO, PaginationDTO, UpdateFlashcardDTO, CefrLevel, FlashcardStatus, FlashcardSource } from "@/types";
```

### Nowe typy dla widoku:

```typescript
// Parametry wyszukiwania
interface FlashcardSearchParams {
  searchTerm: string;
}

// Parametry filtrowania
interface FlashcardFilterParams {
  cefr_level?: CefrLevel;
  status?: FlashcardStatus;
  source?: FlashcardSource;
  sort_by?: "created_at" | "cefr_level" | "front_content";
  sort_order?: "asc" | "desc";
}

// Parametry strony łączące wyszukiwanie, filtry i paginację
interface FlashcardsPageParams extends FlashcardSearchParams, FlashcardFilterParams {
  page: number;
  limit: number;
}

// Dane formularza do edycji fiszki
interface EditFlashcardFormData {
  front_content: string;
  back_content: string;
  cefr_level: CefrLevel;
  front_language: string;
  back_language: string;
}
```

## 6. Zarządzanie stanem

### useFlashcards - Hook do zarządzania fiszkami

```typescript
interface UseFlashcardsReturnType {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
  isLoading: boolean;
  isError: Error | null;
  fetchFlashcards: (params: FlashcardsPageParams) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  updateFlashcard: (id: string, data: UpdateFlashcardDTO) => Promise<void>;
}

function useFlashcards(): UseFlashcardsReturnType {
  // Implementacja zarządzania stanem fiszek
}
```

### useFlashcardFilters - Hook do zarządzania filtrami

```typescript
interface UseFlashcardFiltersReturnType {
  searchTerm: string;
  filters: FlashcardFilterParams;
  page: number;
  limit: number;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FlashcardFilterParams>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  buildQueryParams: () => FlashcardsPageParams;
}

function useFlashcardFilters(): UseFlashcardFiltersReturnType {
  // Implementacja zarządzania filtrami i paginacją
}
```

### useModal - Hook do zarządzania modalami

```typescript
interface UseModalReturnType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

function useModal(initialState: boolean = false): UseModalReturnType {
  // Implementacja zarządzania stanem modala
}
```

## 7. Integracja API

### Pobieranie fiszek

```typescript
async function fetchFlashcards(params: FlashcardsPageParams): Promise<FlashcardListResponseDTO> {
  // Konwertuj parametry na query string
  const queryParams = new URLSearchParams();

  if (params.searchTerm) {
    queryParams.append("search", params.searchTerm);
  }

  if (params.cefr_level) {
    queryParams.append("cefr_level", params.cefr_level);
  }

  if (params.status) {
    queryParams.append("status", params.status);
  }

  if (params.source) {
    queryParams.append("source", params.source);
  }

  if (params.sort_by) {
    queryParams.append("sort_by", params.sort_by);
  }

  if (params.sort_order) {
    queryParams.append("sort_order", params.sort_order);
  }

  queryParams.append("page", params.page.toString());
  queryParams.append("limit", params.limit.toString());

  const response = await fetch(`/api/flashcards?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
```

### Aktualizacja fiszki

```typescript
async function updateFlashcard(id: string, data: UpdateFlashcardDTO): Promise<FlashcardDTO> {
  const response = await fetch(`/api/flashcards/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
```

### Usuwanie fiszki

```typescript
async function deleteFlashcard(id: string): Promise<void> {
  const response = await fetch(`/api/flashcards/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
}
```

## 8. Interakcje użytkownika

### Wyszukiwanie fiszek

1. Użytkownik wprowadza tekst w pasku wyszukiwania
2. System aktualizuje stan `searchTerm` w hooku `useFlashcardFilters`
3. Wyszukiwanie jest debounce'owane, aby ograniczyć liczbę zapytań
4. System wywołuje `fetchFlashcards` z aktualnymi parametrami wyszukiwania
5. Lista fiszek jest aktualizowana z wynikami wyszukiwania

### Filtrowanie fiszek

1. Użytkownik wybiera poziom CEFR z dropdownu
2. System aktualizuje stan `filters` w hooku `useFlashcardFilters`
3. System wywołuje `fetchFlashcards` z aktualnymi parametrami filtrowania
4. Lista fiszek jest aktualizowana z wynikami filtrowania

### Sortowanie fiszek

1. Użytkownik wybiera kryterium sortowania i kierunek
2. System aktualizuje stan `filters` w hooku `useFlashcardFilters`
3. System wywołuje `fetchFlashcards` z aktualnymi parametrami sortowania
4. Lista fiszek jest aktualizowana z prawidłowym sortowaniem

### Paginacja

1. Użytkownik klika przycisk zmiany strony
2. System aktualizuje stan `page` w hooku `useFlashcardFilters`
3. System wywołuje `fetchFlashcards` z aktualnym numerem strony
4. Lista fiszek jest aktualizowana o zawartość wybranej strony

### Edycja fiszki

1. Użytkownik klika przycisk edycji przy fiszce
2. System otwiera modal `FlashcardEditModal` z danymi wybranej fiszki
3. Użytkownik wprowadza zmiany w polach formularza
4. System waliduje wprowadzone dane (długość pól, poprawność danych)
5. Użytkownik klika przycisk "Zapisz"
6. System wywołuje `updateFlashcard` z danymi formularza
7. Po pomyślnej aktualizacji, system zamyka modal i odświeża listę fiszek

### Usuwanie fiszki

1. Użytkownik klika przycisk usunięcia przy fiszce
2. System otwiera modal `FlashcardDeleteModal` z potwierdzeniem
3. Użytkownik klika przycisk "Usuń" dla potwierdzenia
4. System wywołuje `deleteFlashcard` z ID fiszki
5. Po pomyślnym usunięciu, system zamyka modal i odświeża listę fiszek

## 9. Warunki i walidacja

### Walidacja formularza edycji

- Pole `front_content` nie może być puste i nie może przekraczać 200 znaków
- Pole `back_content` nie może być puste i nie może przekraczać 500 znaków
- Pole `cefr_level` musi być jedną z wartości zdefiniowanych w `CefrLevel`
- Pola `front_language` i `back_language` nie mogą być puste

### Walidacja parametrów filtrowania

- Pole `cefr_level` musi być jedną z wartości zdefiniowanych w `CefrLevel` lub `undefined`
- Pole `status` musi być jedną z wartości zdefiniowanych w `FlashcardStatus` lub `undefined`
- Pole `source` musi być jedną z wartości zdefiniowanych w `FlashcardSource` lub `undefined`
- Pole `sort_by` musi być jedną z dozwolonych wartości lub `undefined`
- Pole `sort_order` musi być "asc", "desc" lub `undefined`

### Walidacja parametrów paginacji

- Pole `page` musi być liczbą całkowitą większą od 0
- Pole `limit` musi być liczbą całkowitą większą od 0

## 10. Obsługa błędów

### Błędy API

- 401 Unauthorized: Przekierowanie użytkownika do strony logowania
- 404 Not Found: Wyświetlenie komunikatu o braku fiszki
- 500 Internal Server Error: Wyświetlenie ogólnego komunikatu o błędzie serwera

### Błędy formularza

- Walidacja formularza przed wysłaniem do API
- Wyświetlanie komunikatów błędów walidacji przy odpowiednich polach
- Blokowanie przycisku zapisu, gdy formularz zawiera błędy

### Błędy sieci

- Obsługa timeout'ów i błędów połączenia
- Wyświetlanie komunikatu o braku połączenia
- Możliwość ponowienia próby pobierania danych

### Obsługa pustych stanów

- Wyświetlanie przyjaznego komunikatu, gdy nie ma fiszek do wyświetlenia
- Wyświetlanie komunikatu, gdy wyszukiwanie nie zwróciło wyników

## 11. Kroki implementacji

1. **Przygotowanie struktury komponentów**

   - Utworzenie plików komponentów zgodnie z hierarchią
   - Zdefiniowanie podstawowych propsów i typów

2. **Implementacja głównych komponentów i wyświetlenie zamockowanych fiszek**

   - Implementacja `FlashcardsPageLayout` jako kontenera dla widoku
   - Implementacja `FlashcardsList` i `FlashcardItem` do wyświetlania fiszek

3. **Implementacja głównego hooka do zarządzania listą fiszek**

   - Implementacja `useFlashcards` do zarządzania listą fiszek

4. **Implementacja pozostałych komponentów**

- Implementacja `FlashcardsToolbar` z wyszukiwarką i filtrami
- Implementacja `Pagination` do nawigacji po stronach

5. **Implementacja pozostałych hook'ow do zarządzania stanem**

- Implementacja `useFlashcardFilters` do zarządzania filtrami i wyszukiwaniem
- Implementacja `useModal` do zarządzania oknami modalnymi

6. **Implementacja modali**

   - Implementacja `FlashcardEditModal` do edycji fiszek
   - Implementacja `FlashcardDeleteModal` do potwierdzania usunięcia fiszek

7. **Integracja z API**

   - Implementacja funkcji pobierania fiszek
   - Implementacja funkcji aktualizacji fiszki
   - Implementacja funkcji usuwania fiszki
   - Obsługa błędów API

8. **Implementacja walidacji**

   - Implementacja walidacji formularza edycji
   - Implementacja walidacji parametrów filtrowania
   - Implementacja walidacji parametrów paginacji

9. **Optymalizacja wydajności**
   - Debouncing wyszukiwania
   - Optymalizacja renderowania listy
   - Implementacja memorizowanych selektorów
