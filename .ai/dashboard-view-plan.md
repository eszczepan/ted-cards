# Plan implementacji widoku Dashboard

## 1. Przegląd

Widok Dashboard (`/dashboard`) jest głównym interfejsem dla zalogowanych użytkowników, umożliwiającym generowanie fiszek edukacyjnych przy użyciu AI na podstawie linku YouTube lub wklejonego tekstu. Użytkownicy mogą przeglądać wygenerowane propozycje fiszek, akceptować je, edytować lub odrzucać, a następnie zapisywać zaakceptowane fiszki w swojej kolekcji. Widok zawiera formularz generowania, listę propozycji oraz mechanizmy informacji zwrotnej (wskaźniki ładowania, błędy).

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/dashboard`.

## 3. Struktura komponentów

```
app/dashboard/page.tsx (DashboardView)
├── components/dashboard/GenerationForm.tsx
│   ├── components/dashboard/SourceTypeSwitcher.tsx (Tabs: YouTube/Text)
│   ├── Shadcn Input (dla URL)
│   ├── Shadcn Textarea (dla tekstu)
│   │   └── components/shared/CharacterCounter.tsx
│   ├── Shadcn Select (dla języka przodu)
│   ├── Shadcn Select (dla języka tyłu)
│   ├── Shadcn Button (przycisk "Generate")
│   └── components/shared/InlineAlert.tsx (dla błędów formularza)
└── components/dashboard/ProposalList.tsx
    ├── components/shared/SkeletonLoader.tsx (wyświetlany podczas ładowania)
    ├── Shadcn Button (przycisk "Zapisz wszystkie")
    ├── Shadcn Button (przycisk "Zapisz zaakceptowane")
    ├── components/shared/InlineAlert.tsx (dla błędów/info listy)
    └── components/dashboard/ProposalCard.tsx (mapowany po propozycjach)
        ├── Shadcn Select (dla poziomu CEFR)
        ├── Shadcn Button (Akceptuj)
        ├── Shadcn Button (Edytuj)
        ├── Shadcn Button (Odrzuć)
        └── [Elementy formularza edycji - widoczne warunkowo]
            ├── Shadcn Input (dla przodu fiszki)
            ├── Shadcn Textarea (dla tyłu fiszki)
            ├── Shadcn Button (Zapisz zmiany)
            ├── Shadcn Button (Anuluj)
```

## 4. Szczegóły komponentów

### `DashboardView` (`app/dashboard/page.tsx`)

- **Opis:** Główny kontener widoku. Renderuje `GenerationForm` i `ProposalList`.
- **Główne elementy:** `GenerationForm`, `ProposalList`.
- **Obsługiwane interakcje:** Deleguje obsługę zdarzeń do komponentów potomnych i hooka `useDashboard`.
- **Obsługiwana walidacja:** Brak bezpośredniej walidacji.
- **Typy:** `DashboardViewModel` (zarządzany przez hook).
- **Propsy:** Brak (jest to komponent strony).

### `GenerationForm` (`components/dashboard/GenerationForm.tsx`)

- **Opis:** Formularz do inicjowania generowania fiszek. Zawiera przełącznik typu źródła (`SourceTypeSwitcher`), pola do wprowadzenia danych (URL lub tekst), selektory języków i przycisk do uruchomienia generacji. Wyświetla błędy walidacji i licznik znaków dla pola tekstowego.
- **Główne elementy:** `SourceTypeSwitcher`, `Input` (Shadcn), `Textarea` (Shadcn), `CharacterCounter`, `Select` (Shadcn) x2, `Button` (Shadcn), `InlineAlert`.
- **Obsługiwane interakcje:** Zmiana typu źródła, wprowadzanie danych w polach, wybór języków, kliknięcie przycisku "Generate".
- **Obsługiwana walidacja:**
  - `source_type`: Wymagane.
  - `source_youtube_url`: Wymagane i musi być poprawnym URL, jeśli `source_type` to `youtube`.
  - `source_text`: Wymagane, max. 15000 znaków, jeśli `source_type` to `text`.
  - `front_language`: Wymagane.
  - `back_language`: Wymagane.
- **Typy:** `CreateGenerationCommand` (dla danych formularza).
- **Propsy:**
  - `onSubmit: (data: CreateGenerationCommand) => void`
  - `isLoading: boolean`
  - `validationErrors: Record<string, string[]>` (lub podobny typ do wyświetlania błędów Zod)

### `SourceTypeSwitcher` (`components/dashboard/SourceTypeSwitcher.tsx`)

- **Opis:** Komponent zakładek (np. Shadcn `Tabs`) do wyboru źródła danych (YouTube/Text). Powinien używać `motion/react` do animacji przejścia.
- **Główne elementy:** Komponent `Tabs` z Shadcn/ui.
- **Obsługiwane interakcje:** Kliknięcie na zakładkę.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `SourceType`.
- **Propsy:**
  - `value: SourceType`
  - `onChange: (value: SourceType) => void`

### `ProposalList` (`components/dashboard/ProposalList.tsx`)

- **Opis:** Wyświetla listę wygenerowanych propozycji fiszek (`ProposalCard`) lub skeletony (`SkeletonLoader`) w trakcie ładowania. Zawiera przyciski do zapisania wszystkich (nieodrzuconych) lub tylko zaakceptowanych/edytowanych fiszek.
- **Główne elementy:** `SkeletonLoader`, `Button` (Shadcn, "Zapisz wszystkie"), `Button` (Shadcn, "Zapisz zaakceptowane"), `InlineAlert`, `ProposalCard` (mapowany).
- **Obsługiwane interakcje:** Kliknięcie przycisku "Zapisz wszystkie", kliknięcie przycisku "Zapisz zaakceptowane". Deleguje aktualizacje pojedynczych propozycji do `ProposalCard` poprzez `onUpdateProposal`.
- **Obsługiwana walidacja:** Brak bezpośredniej.
- **Typy:** `FlashcardProposalDTO[]`.
- **Propsy:**
  - `proposals: FlashcardProposalDTO[]`
  - `isLoading: boolean` (dla stanu ładowania generacji)
  - `isSaving: boolean` (dla stanu zapisywania, może być rozbite na `isSavingAll` i `isSavingAccepted`)
  - `onSaveAll: () => void`
  - `onSaveAccepted: () => void`
  - `onUpdateProposal: (updatedProposal: FlashcardProposalDTO) => void` (propaguje zmiany z `ProposalCard` do hooka)
  - `error: string | null` (do wyświetlania błędów API)

### `ProposalCard` (`components/dashboard/ProposalCard.tsx`)

- **Opis:** Wyświetla pojedynczą propozycję fiszki. Domyślnie fiszka ma status `ACCEPTED`. Pokazuje treść przodu i tyłu, edytowalny poziom CEFR (dropdown) oraz przyciski akcji (Akceptuj - aby cofnąć odrzucenie, Edytuj, Odrzuć). Zarządza lokalnym stanem edycji.
- **Główne elementy:** Tekst (przód/tył), `Select` (Shadcn) dla CEFR, `Button` (Shadcn) x3 (Akceptuj/Edytuj/Odrzuć). Warunkowo wyświetlane: `Input`/`Textarea` do edycji, `Button` (Zapisz zmiany), `Button` (Anuluj).
- **Obsługiwane interakcje:** Kliknięcie Akceptuj (gdy status `REJECTED`)/Odrzuć/Edytuj, zmiana CEFR, zapisanie/anulowanie edycji. Wszystkie te akcje powinny wywoływać `onUpdate` z zaktualizowanym obiektem propozycji (zmiana `status`, `cefr_level`, treści).
- **Obsługiwana walidacja (w trybie edycji):**
  - `front_content`: Wymagane, max 200 znaków.
  - `back_content`: Wymagane, max 500 znaków.
  - `cefr_level`: Wymagane.
- **Typy:** `FlashcardProposalDTO`.
- **Propsy:**
  - `proposal: FlashcardProposalDTO`
  - `onUpdate: (updatedProposal: FlashcardProposalDTO) => void`

### Komponenty współdzielone (`components/shared/`)

- **`CharacterCounter`:** Przyjmuje `currentLength: number`, `maxLength: number`. Wyświetla "current/max".
- **`InlineAlert`:** Przyjmuje `message: string`, `variant: 'error' | 'info' | 'warning'`, opcjonalnie `onDismiss?: () => void`. Używa Shadcn `Alert`.
- **`SkeletonLoader`:** Przyjmuje propsy do kontroli wyglądu (np. `count`, `height`, `className`). Używa Shadcn `Skeleton`.

## 5. Typy

Implementacja będzie korzystać z typów zdefiniowanych w `types/index.ts`. Kluczowe typy dla tego widoku:

- **Do obsługi formularza i generacji:**
  - `CreateGenerationCommand`: Typ danych wysyłanych w żądaniu POST `/api/generations`.
  - `CreateGenerationResponseDTO`: Typ odpowiedzi z POST `/api/generations`.
  - `FlashcardProposalDTO`: Typ pojedynczej propozycji fiszki zwróconej przez API i zarządzanej w stanie frontendu. Zawiera tymczasowe `id` i `status` (`accepted` - domyślny po generacji, `edited`, `rejected`). Przycisk "Akceptuj" służy do zmiany statusu z `rejected` na `accepted`.
  - `SourceType`: Enum (`youtube`, `text`).
  - `CefrLevel`: Typ dla poziomów CEFR (`A1`...`C2`).
- **Do zapisywania fiszek:**
  - `CreateFlashcardDTO`: Format pojedynczej fiszki wysyłanej w żądaniu POST `/api/flashcards`. Musi być zmapowany z zaakceptowanych/edytowanych `FlashcardProposalDTO`.
  - `CreateFlashcardsCommand`: Obiekt żądania dla POST `/api/flashcards`, zawierający tablicę `flashcards: CreateFlashcardDTO[]` oraz opcjonalny `generation_id`.
  - `CreateFlashcardsResponseDTO`: Typ odpowiedzi z POST `/api/flashcards`.
  - `FlashcardSource`: Enum określający źródło fiszki (`ai_youtube_full`, `ai_text_full`, etc.). Musi być odpowiednio ustawiony podczas mapowania propozycji do `CreateFlashcardDTO`.
- **ViewModel (stan komponentu `DashboardView` / hooka `useDashboard`):**
  - **`DashboardViewModel`**:
    - `generationState: 'idle' | 'loading' | 'success' | 'error'`: Stan wywołania API generacji.
    - `saveState: 'idle' | 'loading' | 'success' | 'error'` (lub rozbite np. `saveAllState`, `saveAcceptedState`): Stan wywołania API zapisywania.
    - `generationError: string | null`: Komunikat błędu z API generacji.
    - `saveError: string | null`: Komunikat błędu z API zapisywania.
    - `proposals: FlashcardProposalDTO[]`: Lista propozycji fiszek, aktualizowana o decyzje użytkownika. Domyślnie każda nowa propozycja ma status `ACCEPTED`.
    - `generationId: string | null`: ID generacji zwrócone przez API, potrzebne do zapisu.
    - `formInput: Partial<CreateGenerationCommand>`: Stan danych wejściowych formularza generowania.
    - `selectedSourceType: SourceType`: Aktualnie wybrany typ źródła w formularzu.

## 6. Zarządzanie stanem

Zaleca się stworzenie customowego hooka, np. `useDashboard`, który będzie hermetyzował całą logikę i stan widoku Dashboard.

- **Hook `useDashboard`:**
  - Będzie używał `useState` lub `useReducer` do zarządzania `DashboardViewModel`.
  - Zawierałby logikę walidacji formularza `GenerationForm` (przy użyciu `zod` i `react-hook-form` lub podobnego rozwiązania).
  - Udostępniałby funkcje do:
    - Aktualizacji stanu formularza (`handleInputChange`, `handleSourceTypeChange`).
    - Obsługi wysłania formularza generacji (`handleGenerateSubmit`), która wywołuje `POST /api/generations`, aktualizuje `generationState`, `proposals` (ustawiając status każdej na `ACCEPTED`), `generationId`, `generationError`.
    - Aktualizacji stanu pojedynczej propozycji (`handleUpdateProposal`), modyfikując tablicę `proposals`.
    - Obsługi zapisywania wszystkich nieodrzuconych fiszek (`handleSaveAll`), która filtruje `proposals` (status != `REJECTED`), mapuje je do `CreateFlashcardDTO[]`, wywołuje `POST /api/flashcards`, aktualizuje `saveState`, `saveError`.
    - Obsługi zapisywania zaakceptowanych/edytowanych fiszek (`handleSaveAccepted`), która filtruje `proposals` (status `ACCEPTED` lub `EDITED`), mapuje je do `CreateFlashcardDTO[]`, wywołuje `POST /api/flashcards`, aktualizuje `saveState`, `saveError`.
  - Zwracałby wszystkie potrzebne fragmenty stanu i funkcje obsługi dla komponentów `DashboardView`, `GenerationForm`, `ProposalList`.

## 7. Integracja API

1.  **Generowanie fiszek:**
    - **Trigger:** Kliknięcie przycisku "Generate" w `GenerationForm`.
    - **Wywołanie:** `POST /api/generations`
    - **Typ żądania:** `CreateGenerationCommand`
    - **Typ odpowiedzi:** `CreateGenerationResponseDTO`
    - **Obsługa:** Aktualizacja stanu `generationState`, `proposals`, `generationId`, `generationError`. Wyświetlanie `SkeletonLoader` w `ProposalList` podczas `generationState === 'loading'`.
2.  **Zapisywanie fiszek:**
    - **Trigger:** Kliknięcie przycisku "Zapisz zaakceptowane" LUB "Zapisz wszystkie" w `ProposalList`.
    - **Wywołanie:** `POST /api/flashcards`
    - **Typ żądania:** `CreateFlashcardsCommand` (zawiera `generationId` oraz tablicę `flashcards` zmapowaną z propozycji):
      - Dla "Zapisz zaakceptowane": tylko propozycje o statusie `ACCEPTED` lub `EDITED`.
      - Dla "Zapisz wszystkie": propozycje o statusie `ACCEPTED` lub `EDITED`. (Zakładamy, że odrzucone nie są zapisywane).
    - **Typ odpowiedzi:** `CreateFlashcardsResponseDTO`
    - **Obsługa:** Aktualizacja stanu `saveState`, `saveError`. Wyświetlanie wskaźnika ładowania (np. na przycisku) podczas `saveState === 'loading'`. Po sukcesie można wyświetlić powiadomienie (np. Toast) i wyczyścić listę propozycji lub zaktualizować ich stan (np. oznaczyć jako zapisane, jeśli chcemy je nadal wyświetlać).

## 8. Interakcje użytkownika

- **Wybór typu źródła:** Zmienia widoczne pola w formularzu (URL vs Text Area). Animacja przejścia (`motion/react`).
- **Wprowadzanie danych:** Aktualizacja stanu formularza, walidacja na bieżąco, aktualizacja licznika znaków.
- **Kliknięcie "Generate":** Rozpoczęcie procesu generacji, wyświetlenie stanu ładowania, zablokowanie formularza.
- **Przeglądanie propozycji:** Lista fiszek renderowana po zakończeniu generacji. Wszystkie fiszki mają domyślnie status `ACCEPTED`.
- **Akcje na propozycji (Akceptuj/Odrzuć/Edytuj/Zmień CEFR):** Aktualizacja wizualna karty i stanu `proposals` w hooku `useDashboard`.
  - **Akceptuj:** Aktywne tylko gdy status jest `REJECTED`. Zmienia status na `ACCEPTED`.
  - **Odrzuć:** Zmienia status na `REJECTED`.
  - **Edycja:** `ProposalCard` przechodzi w tryb edycji, pokazując pola formularza i przyciski Zapisz/Anuluj. Walidacja pól edycji.
  - **Zapisz Edycję:** Aktualizuje dane propozycji w stanie hooka, zmienia status na `EDITED`, wychodzi z trybu edycji.
  - **Anuluj Edycję:** Wychodzi z trybu edycji bez zapisywania zmian.
- **Kliknięcie "Zapisz zaakceptowane":** Rozpoczęcie procesu zapisywania tylko fiszek ze statusem `ACCEPTED` lub `EDITED`. Wyświetlenie stanu ładowania.
- **Kliknięcie "Zapisz wszystkie":** Rozpoczęcie procesu zapisywania wszystkich fiszek ze statusem `ACCEPTED` lub `EDITED`. Wyświetlenie stanu ładowania.

## 9. Warunki i walidacja

- **Formularz generacji (`GenerationForm`):**
  - Przycisk "Generate" jest aktywny tylko, gdy formularz jest poprawny (zgodnie z walidacją Zod/react-hook-form) i `generationState !== 'loading'`.
  - Błędy walidacji są wyświetlane jako komunikaty przy odpowiednich polach (`InlineAlert`).
  - Licznik znaków dla pola tekstowego aktualizuje się na bieżąco i może zmieniać kolor po przekroczeniu limitu.
- **Edycja propozycji (`ProposalCard`):**
  - Przycisk "Zapisz zmiany" jest aktywny tylko, gdy pola edycji (`front_content`, `back_content`) są poprawne (niepuste, w limitach znaków).
  - Błędy walidacji są wyświetlane przy polach edycji.
- **Zapisywanie fiszek (`ProposalList`):**
  - Przycisk "Zapisz zaakceptowane" jest aktywny tylko, gdy `saveState !== 'loading'` i istnieje co najmniej jedna propozycja ze statusem `ACCEPTED` lub `EDITED`.
  - Przycisk "Zapisz wszystkie" jest aktywny tylko, gdy `saveState !== 'loading'` i istnieje co najmniej jedna propozycja ze statusem `ACCEPTED` lub `EDITED`.

## 10. Obsługa błędów

- **Błędy walidacji formularza:** Obsługiwane lokalnie w `GenerationForm` (z użyciem Zod/react-hook-form), wyświetlane za pomocą `InlineAlert`.
- **Błędy walidacji edycji:** Obsługiwane lokalnie w `ProposalCard`, wyświetlane przy polach.
- **Błędy API (`POST /api/generations`):**
  - Błąd przechwytywany w hooku `useDashboard`.
  - Ustawiany jest `generationState = 'error'` i `generationError` z komunikatem błędu (z odpowiedzi API lub generyczny).
  - Błąd wyświetlany w `ProposalList` za pomocą `InlineAlert`.
- **Błędy API (`POST /api/flashcards`):**
  - Błąd przechwytywany w hooku `useDashboard`.
  - Ustawiany jest `saveState = 'error'` i `saveError` z komunikatem błędu.
  - Błąd wyświetlany (np. jako Toast lub `InlineAlert` w `ProposalList`). Stan propozycji jest zachowany, umożliwiając ponowną próbę zapisu.
- **Brak propozycji:** Jeśli API zwróci pustą tablicę `flashcard_proposals`, `ProposalList` powinien wyświetlić odpowiedni komunikat (np. "Nie udało się wygenerować fiszek dla podanego źródła.").

## 11. Kroki implementacji

1.  **Stworzenie struktury plików:** Utwórz plik strony `app/dashboard/page.tsx` oraz pliki dla komponentów: `GenerationForm.tsx`, `SourceTypeSwitcher.tsx`, `ProposalList.tsx`, `ProposalCard.tsx` w katalogu `components/dashboard/`. Utwórz potrzebne komponenty w `components/shared/` (`CharacterCounter.tsx`, `InlineAlert.tsx`, `SkeletonLoader.tsx`), jeśli jeszcze nie istnieją.
2.  **Implementacja hooka `useDashboard`:** Zdefiniuj `DashboardViewModel`, zaimplementuj logikę zarządzania stanem, funkcje obsługi API. Ustaw domyślny status propozycji na `ACCEPTED` po generacji. Dodaj funkcję `handleSaveAll`. Zmień nazwę `handleSave` na `handleSaveAccepted`.
3.  **Implementacja `DashboardView`:** Podłącz hook `useDashboard`, przekaż stan i funkcje obsługi do komponentów potomnych `GenerationForm` i `ProposalList`.
4.  **Implementacja `GenerationForm`:** Zbuduj strukturę formularza używając komponentów Shadcn/ui. Podłącz propsy z `DashboardView`/`useDashboard` do obsługi stanu, walidacji i wysyłania. Zintegruj `SourceTypeSwitcher` i `CharacterCounter`. Dodaj obsługę wyświetlania błędów walidacji.
5.  **Implementacja `SourceTypeSwitcher`:** Użyj komponentu `Tabs` z Shadcn i dodaj animacje za pomocą `motion/react`.
6.  **Implementacja `ProposalList`:** Zbuduj strukturę listy. Dodaj przycisk "Zapisz wszystkie" i podłącz go do `onSaveAll`. Zmień podłączenie przycisku "Zapisz zaakceptowane" do `onSaveAccepted`. Dodaj warunki deaktywacji przycisków.
7.  **Implementacja `ProposalCard`:** Zbuduj strukturę karty. Ustaw wizualizację domyślnego stanu `ACCEPTED`. Zmodyfikuj logikę przycisku "Akceptuj", aby był aktywny tylko dla statusu `REJECTED`.
8.  **Integracja API:** Upewnij się, że obie akcje zapisu (`handleSaveAll` i `handleSaveAccepted`) poprawnie filtrują propozycje i wysyłają dane do `POST /api/flashcards`.
9.  **Stylowanie i UX:** Dopracuj wygląd komponentów używając Tailwind. Upewnij się, że przejścia i stany ładowania są płynne. Zadbaj o responsywność widoku.
10. **Testowanie:** Przetestuj nowe scenariusze: domyślny status zaakceptowany, odrzucanie, cofanie odrzucenia, użycie obu przycisków zapisu ("Zapisz wszystkie" i "Zapisz zaakceptowane").
