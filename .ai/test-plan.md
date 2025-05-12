# Plan Testów Aplikacji TedCards

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument przedstawia plan testów dla aplikacji webowej TedCards, której celem jest automatyczne generowanie fiszek edukacyjnych z filmów YouTube oraz tekstu przy użyciu sztucznej inteligencji. Plan obejmuje strategię, zakres, zasoby i harmonogram działań testowych mających na celu zapewnienie jakości, stabilności i bezpieczeństwa aplikacji przed jej wdrożeniem oraz w kolejnych fazach rozwoju. Projekt jest obecnie w fazie MVP.

### 1.2. Cele Testowania

Główne cele procesu testowania aplikacji TedCards to:

- **Weryfikacja funkcjonalności:** Sprawdzenie, czy wszystkie kluczowe funkcje aplikacji (generowanie fiszek, autentykacja, zarządzanie fiszkami) działają zgodnie z wymaganiami opisanymi w dokumentacji (`prd.md`, `api-plan.md`, `auth-spec.md`).
- **Zapewnienie jakości:** Identyfikacja i raportowanie defektów w celu poprawy ogólnej jakości aplikacji.
- **Ocena wydajności:** Weryfikacja czasu odpowiedzi kluczowych operacji (generowanie fiszek, ładowanie interfejsu).
- **Ocena użyteczności i UX:** Sprawdzenie, czy interfejs użytkownika jest intuicyjny, łatwy w obsłudze i responsywny.
- **Weryfikacja bezpieczeństwa:** Identyfikacja potencjalnych luk bezpieczeństwa, zwłaszcza w obszarze autentykacji i walidacji danych.
- **Sprawdzenie integracji:** Upewnienie się, że integracja z usługami zewnętrznymi (Supabase, OpenRouter.ai, YouTube API/libraries) działa poprawnie i jest odporna na błędy.
- **Zgodność ze specyfikacją:** Potwierdzenie, że aplikacja spełnia wymagania techniczne i biznesowe.

## 2. Zakres Testów

### 2.1. Funkcjonalności objęte testami

- **Generowanie fiszek:**
  - Generowanie z linku YouTube (poprawność pobierania transkrypcji, interakcja z AI, obsługa różnych linków i scenariuszy).
  - Generowanie z wklejonego tekstu (obsługa różnych długości tekstu, walidacja limitu znaków).
  - Poprawność działania AI (ocena jakości generowanych propozycji - głównie manualna).
  - Poprawność przypisywania poziomu CEFR.
  - Wybór języka frontu i tyłu fiszki.
  - Obsługa błędów generacji (komunikaty dla użytkownika, logowanie po stronie serwera).
- **Zarządzanie propozycjami fiszek:**
  - Wyświetlanie listy propozycji.
  - Akceptowanie, edytowanie (treść, CEFR), odrzucanie propozycji.
  - Walidacja danych podczas edycji.
- **Zapisywanie fiszek:**
  - Zapisywanie pojedynczych zaakceptowanych/edytowanych fiszek (niezaimplementowane jawnie, ale wynika z logiki).
  - Zapisywanie wszystkich zaakceptowanych/edytowanych fiszek ("Save Accepted").
  - Zapisywanie wszystkich nieodrzuconych fiszek ("Save All").
  - Poprawność zapisu danych w bazie Supabase (tabela `flashcards`).
- **Autentykacja:**
  - Rejestracja nowego użytkownika (wraz z potwierdzeniem email).
  - Logowanie zarejestrowanego i potwierdzonego użytkownika.
  - Proces resetowania hasła (żądanie linku, ustawienie nowego hasła).
  - Wylogowywanie.
  - Zarządzanie sesją (odświeżanie tokenów, ochrona tras).
- **Interfejs Użytkownika:**
  - Responsywność widoków (Landing Page, Dashboard, Formularze Autentykacji).
  - Działanie komponentów UI (przyciski, formularze, selektory, taby, alerty, animacje - podstawowa weryfikacja).
  - Nawigacja (Sidebar, linki).
  - Wyświetlanie stanu ładowania i błędów.
- **Landing Page:**
  - Poprawność wyświetlania treści i obrazów.
  - Działanie linków (np. do logowania/rejestracji).
- **API Backendu (Next.js API Routes):**
  - Poprawność działania endpointów `/api/generations` i `/api/flashcards`.
  - Walidacja danych wejściowych (schematy Zod).
  - Obsługa błędów i zwracanie odpowiednich kodów HTTP.
- **Baza Danych (Supabase):**
  - Poprawność schematu i migracji.
  - Integralność danych.
  - Działanie funkcji bazodanowych (`check_youtube_url_exists`, `get_user_flashcard_stats`).
  - RLS (gdy zostaną włączone).
- **System Powtórek:** (Zakres ograniczony do weryfikacji istnienia podstawowej funkcjonalności, jeśli jest dostępna w MVP).

### 2.2. Funkcjonalności wyłączone z testów (lub o niższym priorytecie w fazie MVP)

- Zaawansowane algorytmy Spaced Repetition (zgodnie z `README.md`).
- Śledzenie postępów, statystyki, codzienne serie (zgodnie z `README.md`).
- Import z innych formatów (PDF, DOCX) (zgodnie z `README.md`).
- Udostępnianie zestawów fiszek (zgodnie z `README.md`).
- Personalizacja tematyczna (zgodnie z `README.md`).
- Aplikacje mobilne i synchronizacja między urządzeniami (zgodnie z `README.md`).
- Ręczne tworzenie fiszek przez dedykowany formularz (brak widocznej implementacji w dostarczonym kodzie).
- Zaawansowane testy obciążeniowe (poza podstawowymi testami wydajności).
- Kompleksowe testy penetracyjne (zalecane w późniejszej fazie).

## 3. Typy Testów

- **Testy Jednostkowe (Unit Tests):**
  - **Cel:** Weryfikacja poprawności działania izolowanych komponentów, funkcji, hooków, schematów walidacji, logiki serwisów.
  - **Zakres:** Funkcje pomocnicze (`lib/utils`), schematy Zod (`lib/schemas`, `api/**/schema.ts`), komponenty UI (zwłaszcza te z logiką, np. `ProposalCard`, `GenerationForm`), hooki (`useDashboard`, `use-mobile`), logika serwisów (`FlashcardService`, `GenerationService`, `YoutubeService`, `OpenRouterService` - z mockowaniem zależności).
  - **Narzędzia:** Vitest, React Testing Library (RTL), `ts-node`.
- **Testy Integracyjne (Integration Tests):**
  - **Cel:** Weryfikacja współpracy między różnymi modułami systemu.
  - **Zakres:**
    - Frontend: Interakcje w Client Components (`DashboardView` - formularz -> lista propozycji -> zapis), działanie formularzy autentykacji z Server Actions.
    - Backend: Testowanie API Routes (`/api/generations`, `/api/flashcards`) z uwzględnieniem logiki serwisów i interakcji z bazą danych (na testowej instancji Supabase). Testowanie Server Actions.
    - Baza Danych: Testowanie migracji, funkcji DB, RLS (na testowej instancji).
    - Integracja z AI: Testowanie `OpenRouterService` z mockowanym lub prawdziwym API (kontrolowane).
  - **Narzędzia:** Vitest + RTL (dla frontendu), `supertest` lub `fetch` (dla API), Supabase CLI (do zarządzania bazą testową).
- **Testy End-to-End (E2E Tests):**
  - **Cel:** Symulacja rzeczywistych przepływów użytkownika w kompletnej aplikacji.
  - **Zakres:** Kluczowe scenariusze: rejestracja -> potwierdzenie email -> logowanie -> generowanie fiszek (YouTube/tekst) -> przeglądanie/edycja propozycji -> zapisanie fiszek -> wylogowanie. Reset hasła.
  - **Narzędzia:** Playwright.
- **Testy Wizualne (Visual Regression Tests):**
  - **Cel:** Wykrywanie niezamierzonych zmian w wyglądzie UI.
  - **Zakres:** Kluczowe strony/komponenty (Landing Page, Dashboard, formularze).
  - **Narzędzia:** Chromatic, Percy (integrowane z CI).
- **Testy Wydajnościowe (Performance Tests):**
  - **Cel:** Pomiar czasu odpowiedzi kluczowych operacji.
  - **Zakres:** Czas generowania fiszek, czas odpowiedzi API, czas ładowania strony (LCP, FCP).
  - **Narzędzia:** Narzędzia deweloperskie przeglądarki (Lighthouse, Performance tab), `k6` lub podobne (dla API).
- **Testy Bezpieczeństwa (Security Tests):**
  - **Cel:** Identyfikacja podstawowych luk bezpieczeństwa.
  - **Zakres:** Walidacja danych wejściowych (API, formularze), ochrona endpointów API i Server Actions, zarządzanie sesją, testowanie RLS (gdy włączone), sprawdzanie zależności (np. `npm audit`). Podstawowa weryfikacja nagłówków bezpieczeństwa.
  - **Narzędzia:** Manualna inspekcja kodu, narzędzia deweloperskie przeglądarki, OWASP ZAP (podstawowe skanowanie), `npm audit`.
- **Testy Dostępności (Accessibility Tests):**
  - **Cel:** Zapewnienie zgodności z wytycznymi WCAG.
  - **Zakres:** Wszystkie interaktywne elementy UI.
  - **Narzędzia:** `axe-core` (z RTL lub w E2E), manualna weryfikacja (np. nawigacja klawiaturą, czytniki ekranu).
- **Testy Manualne Eksploracyjne:**
  - **Cel:** Odkrywanie nieprzewidzianych błędów i problemów z użytecznością przez swobodne eksplorowanie aplikacji.
  - **Zakres:** Cała aplikacja, ze szczególnym uwzględnieniem nowych funkcjonalności i obszarów ryzyka.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

(Przykładowe scenariusze, lista nie jest wyczerpująca)

### 4.1. Generowanie Fiszki z YouTube

- **TC-GEN-YT-001:** Pomyślne generowanie fiszek dla poprawnego linku YouTube z napisami EN, język docelowy PL.
  - **Kroki:** Zaloguj się. Przejdź do Dashboard. Wybierz "YouTube Link". Wklej poprawny URL. Wybierz Front: EN, Back: PL. Kliknij "Generate Flashcards".
  - **Oczekiwany Rezultat:** Wskaźnik ładowania. Po zakończeniu, lista propozycji fiszek (min. 1) pojawia się w sekcji "Generated Flashcards". Treść fiszek jest adekwatna do filmu, w poprawnych językach, z przypisanym CEFR. Brak błędów.
- **TC-GEN-YT-002:** Próba generowania z nieprawidłowym linkiem YouTube.
  - **Kroki:** Jak w TC-GEN-YT-001, ale wklej nieprawidłowy URL.
  - **Oczekiwany Rezultat:** Błąd walidacji formularza przy polu URL. Przycisk "Generate" może być nieaktywny lub po kliknięciu pojawia się błąd API (400 Bad Request) z komunikatem.
- **TC-GEN-YT-003:** Próba generowania z linkiem do filmu bez napisów (lub w nieobsługiwanym języku).
  - **Kroki:** Jak w TC-GEN-YT-001, ale użyj URL filmu bez napisów EN.
  - **Oczekiwany Rezultat:** Aplikacja powinna obsłużyć błąd (np. z `youtube-captions-scraper`) i wyświetlić użytkownikowi odpowiedni komunikat błędu. W logach serwera powinien pojawić się szczegółowy błąd.
- **TC-GEN-YT-004:** Generowanie z bardzo długiego filmu (test limitu transkrypcji 15k znaków).
  - **Kroki:** Jak w TC-GEN-YT-001, użyj linku do długiego filmu.
  - **Oczekiwany Rezultat:** Fiszki generowane są na podstawie pierwszych ~15000 znaków transkrypcji. Proces kończy się sukcesem.
- **TC-GEN-YT-005:** Próba generowania, gdy API AI (OpenRouter) jest niedostępne lub zwraca błąd.
  - **Kroki:** (Wymaga mockowania API lub testów w kontrolowanym środowisku) Symuluj błąd 5xx lub 429 z OpenRouter.
  - **Oczekiwany Rezultat:** Aplikacja wyświetla użytkownikowi komunikat o błędzie generacji. Logika retry w `OpenRouterService` jest testowana. Błąd jest logowany w `generation_error_logs`.

### 4.2. Generowanie Fiszki z Tekstu

- **TC-GEN-TXT-001:** Pomyślne generowanie fiszek dla poprawnego tekstu (EN -> PL).
  - **Kroki:** Zaloguj się. Przejdź do Dashboard. Wybierz "Text Input". Wklej tekst (np. 500 znaków). Wybierz Front: EN, Back: PL. Kliknij "Generate Flashcards".
  - **Oczekiwany Rezultat:** Jak w TC-GEN-YT-001, fiszki adekwatne do wklejonego tekstu.
- **TC-GEN-TXT-002:** Próba generowania z pustym polem tekstowym.
  - **Kroki:** Jak w TC-GEN-TXT-001, ale zostaw pole tekstowe puste.
  - **Oczekiwany Rezultat:** Błąd walidacji formularza przy polu tekstowym.
- **TC-GEN-TXT-003:** Próba generowania z tekstem przekraczającym limit 15000 znaków.
  - **Kroki:** Jak w TC-GEN-TXT-001, ale wklej tekst > 15000 znaków.
  - **Oczekiwany Rezultat:** Błąd walidacji formularza (wyświetlany przez `CharacterCounter` i Zod). Przycisk "Generate" nieaktywny lub błąd po kliknięciu.
- **TC-GEN-TXT-004:** Próba generowania przy błędzie API AI.
  - **Kroki:** Jak w TC-GEN-YT-005, ale dla źródła tekstowego.
  - **Oczekiwany Rezultat:** Jak w TC-GEN-YT-005.

### 4.3. Zarządzanie Propozycjami i Zapis Fiszki

- **TC-MGMT-001:** Akceptacja i zapis pojedynczej propozycji.
  - **Kroki:** Po udanej generacji (np. TC-GEN-YT-001), znajdź propozycję. Kliknij "Accept". Kliknij "Save Accepted".
  - **Oczekiwany Rezultat:** Propozycja zmienia status (wizualnie lub wewnętrznie). Po kliknięciu "Save Accepted", wskaźnik zapisywania. Propozycja znika z listy. W bazie danych (tabela `flashcards`) pojawia się nowy rekord z poprawnymi danymi.
- **TC-MGMT-002:** Edycja, akceptacja i zapis propozycji.
  - **Kroki:** Po udanej generacji, znajdź propozycję. Kliknij "Edit". Zmień treść frontu, tyłu i poziom CEFR. Kliknij "Save" (w karcie propozycji). Kliknij "Save Accepted".
  - **Oczekiwany Rezultat:** Propozycja przechodzi w tryb edycji. Walidacja działa podczas edycji. Po zapisie zmian w karcie, status zmienia się na EDITED. Po kliknięciu "Save Accepted", propozycja znika, a w bazie `flashcards` pojawia się rekord ze zmodyfikowanymi danymi i źródłem np. `ai_youtube_edited`.
- **TC-MGMT-003:** Odrzucenie propozycji.
  - **Kroki:** Po udanej generacji, znajdź propozycję. Kliknij "Reject".
  - **Oczekiwany Rezultat:** Propozycja znika z listy (lub jest oznaczona jako odrzucona i filtrowana). Nie jest zapisywana przy "Save Accepted" ani "Save All".
- **TC-MGMT-004:** Zapis wszystkich nieodrzuconych propozycji.
  - **Kroki:** Po udanej generacji, zaakceptuj/edytuj kilka propozycji, odrzuć jedną. Kliknij "Save All".
  - **Oczekiwany Rezultat:** Wskaźnik zapisywania. Wszystkie zaakceptowane i edytowane propozycje znikają z listy. W bazie `flashcards` pojawiają się odpowiednie rekordy. Odrzucona propozycja nie jest zapisywana.
- **TC-MGMT-005:** Próba edycji z nieprawidłowymi danymi.
  - **Kroki:** Wejdź w tryb edycji propozycji. Wprowadź zbyt długi tekst w polu front/back lub usuń zawartość wymaganego pola. Spróbuj zapisać zmiany w karcie.
  - **Oczekiwany Rezultat:** Komunikaty błędów walidacji pojawiają się przy odpowiednich polach. Zapis nie jest możliwy, dopóki błędy nie zostaną poprawione.

### 4.4. Autentykacja

- **TC-AUTH-001:** Pomyślna rejestracja i potwierdzenie email.
  - **Kroki:** Przejdź do `/signup`. Wpisz nowy, unikalny email i zgodne hasła (min. 6 znaków). Kliknij "Sign up". Sprawdź email, kliknij link potwierdzający.
  - **Oczekiwany Rezultat:** Komunikat o wysłaniu emaila. Po kliknięciu linku, użytkownik jest przekierowany do `/dashboard` i zalogowany. W bazie Supabase użytkownik ma potwierdzony email.
- **TC-AUTH-002:** Próba rejestracji z istniejącym adresem email.
  - **Kroki:** Przejdź do `/signup`. Wpisz email już istniejącego użytkownika. Wpisz hasła. Kliknij "Sign up".
  - **Oczekiwany Rezultat:** Komunikat błędu informujący, że użytkownik o tym emailu już istnieje.
- **TC-AUTH-003:** Próba rejestracji z niezgodnymi hasłami.
  - **Kroki:** Przejdź do `/signup`. Wpisz email. Wpisz różne hasła w polach "Password" i "Confirm Password".
  - **Oczekiwany Rezultat:** Błąd walidacji przy polu "Confirm Password".
- **TC-AUTH-004:** Pomyślne logowanie.
  - **Kroki:** Przejdź do `/login`. Wpisz poprawny email i hasło potwierdzonego użytkownika. Kliknij "Sign in".
  - **Oczekiwany Rezultat:** Użytkownik zostaje przekierowany do `/dashboard`.
- **TC-AUTH-005:** Próba logowania z nieprawidłowym hasłem.
  - **Kroki:** Przejdź do `/login`. Wpisz poprawny email i złe hasło. Kliknij "Sign in".
  - **Oczekiwany Rezultat:** Komunikat błędu "Invalid login credentials".
- **TC-AUTH-006:** Próba logowania z niepotwierdzonym adresem email.
  - **Kroki:** Zarejestruj użytkownika, ale nie klikaj linku potwierdzającego. Przejdź do `/login`. Wpisz email i hasło. Kliknij "Sign in".
  - **Oczekiwany Rezultat:** Komunikat błędu informujący o konieczności potwierdzenia emaila (lub "Invalid login credentials", w zależności od konfiguracji Supabase).
- **TC-AUTH-007:** Pomyślny proces resetowania hasła.
  - **Kroki:** Przejdź do `/login`, kliknij "Forgot your password?". Przejdź do `/reset-password`. Wpisz email istniejącego użytkownika. Kliknij "Send password reset link". Sprawdź email, kliknij link resetujący. Przejdź do `/update-password`. Wpisz nowe, zgodne hasła. Kliknij "Set new password". Spróbuj zalogować się nowym hasłem.
  - **Oczekiwany Rezultat:** Komunikat o wysłaniu linku. Po kliknięciu linku, przekierowanie na `/update-password`. Po ustawieniu nowego hasła, przekierowanie na `/login` z komunikatem sukcesu. Logowanie nowym hasłem działa.
- **TC-AUTH-008:** Próba dostępu do `/dashboard` bez logowania.
  - **Kroki:** Wyloguj się (jeśli zalogowany). Spróbuj przejść bezpośrednio do `/dashboard`.
  - **Oczekiwany Rezultat:** Użytkownik zostaje przekierowany na `/login`.
- **TC-AUTH-009:** Pomyślne wylogowanie.
  - **Kroki:** Zaloguj się. Kliknij przycisk "Log out" w sidebarze.
  - **Oczekiwany Rezultat:** Użytkownik zostaje przekierowany na `/login` lub stronę główną. Sesja zostaje zakończona.

## 5. Środowisko Testowe

- **Środowisko Deweloperskie:** Lokalne maszyny deweloperów (`npm run dev`) z lokalną instancją Supabase (przez Supabase CLI) lub dedykowaną instancją deweloperską Supabase w chmurze.
- **Środowisko Staging/Testowe:** Oddzielna instancja aplikacji wdrożona na DigitalOcean (lub innej platformie np. Vercel dla łatwiejszych preview deployments) połączona z dedykowaną, odizolowaną instancją Supabase (staging). Dane na tym środowisku powinny być anonimizowane lub syntetyczne. Tutaj będą przeprowadzane testy E2E, UAT, wydajnościowe.
- **Środowisko Produkcyjne:** Dostęp ogranicznony. Po wdrożeniu przeprowadzane będą jedynie testy typu smoke test.
- **Przeglądarki:**
  - Główne: Chrome (najnowsza), Firefox (najnowsza).
  - Dodatkowe: Safari (najnowsza), Edge (najnowsza).
  - Mobilne: Chrome na Android, Safari na iOS (emulacja w narzędziach deweloperskich oraz testy na realnych urządzeniach).
- **Dane Testowe:** Zestaw predefiniowanych linków YouTube (z napisami, bez napisów, krótkie, długie), fragmentów tekstu (różne języki, długości, znaki specjalne), kont użytkowników (potwierdzone, niepotwierdzone, z różnymi danymi).

## 6. Narzędzia do Testowania

- **Framework do Testów Jednostkowych/Integracyjnych:** Vitest.
- **Biblioteka do Testowania Komponentów React:** React Testing Library (RTL).
- **Framework do Testów E2E:** Playwright.
- **Narzędzia do Testów Dostępności:** `axe-core`, Lighthouse, czytniki ekranu (VoiceOver, NVDA).
- **Narzędzia do Testów Wydajności:** Lighthouse, Narzędzia Deweloperskie Przeglądarki, `k6` (opcjonalnie).
- **Narzędzia do Testów API:** `supertest`, Postman/Insomnia (do testów eksploracyjnych API).
- **System Zarządzania Testami/Błędami:** GitHub Issues.
- **CI/CD:** GitHub Actions (do automatyzacji uruchamiania testów).
- **Supabase CLI:** Do zarządzania lokalnym/testowym środowiskiem Supabase.

## 7. Harmonogram Testów

_Harmonogram jest przykładowy i powinien być dostosowany do realnego planu projektu._

- **Faza Rozwoju (Sprinty):**
  - Testy jednostkowe i integracyjne pisane równolegle z kodem przez deweloperów.
  - Testy manualne kluczowych funkcjonalności przez QA na koniec sprintu (na środowisku deweloperskim/staging).
  - Uruchamianie testów automatycznych w CI przy każdym pushu/pull requeście.
- **Faza Stabilizacji (Przed Wydaniem MVP):**
  - Pełna runda testów E2E.
  - Testy eksploracyjne.
  - Testy regresji.
  - Testy wydajnościowe (podstawowe).
  - Testy dostępności.
  - Testy wizualne.
  - User Acceptance Testing (UAT) - jeśli dotyczy.
- **Po Wydaniu MVP (Ciągłe Testowanie):**
  - Testy regresji dla każdej nowej funkcjonalności lub poprawki.
  - Regularne uruchamianie testów E2E i wizualnych w CI/CD.
  - Okresowe przeglądy bezpieczeństwa i wydajności.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów)

- Kod źródłowy dostępny w repozytorium.
- Aplikacja zbudowana i wdrożona na odpowiednim środowisku testowym.
- Dostępne środowisko testowe (Supabase, API AI).
- Podstawowa dokumentacja funkcjonalności (np. PRD, User Stories) jest dostępna.
- Zakończone testy jednostkowe i integracyjne dla testowanej funkcjonalności (pass rate > 95%).

### 8.2. Kryteria Wyjścia (Zakończenia Testów / Gotowości do Wydania)

- Wszystkie zaplanowane scenariusze testowe (manualne i automatyczne) zostały wykonane.
- Osiągnięto wymagany poziom pokrycia kodu testami (np. jednostkowe > 70%, integracyjne > 50%).
- Pass rate dla testów automatycznych (jednostkowych, integracyjnych, E2E) wynosi 100%.
- Wszystkie krytyczne (Critical) i wysokie (High) błędy zostały naprawione i zweryfikowane.
- Liczba otwartych błędów średnich (Medium) i niskich (Low) jest akceptowalna przez interesariuszy projektu.
- Wyniki testów wydajności, bezpieczeństwa i dostępności spełniają zdefiniowane progi (jeśli zostały określone).
- Dokumentacja testowa (raporty z testów, status błędów) jest aktualna.
