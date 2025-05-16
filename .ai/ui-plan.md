# Architektura UI dla TedCards

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika dla TedCards dzieli aplikację na dwa główne obszary: widoki publiczne (dla niezalogowanych) oraz widoki chronione (dla zalogowanych użytkowników). Podejście to umożliwia oddzielenie elementów nawigacyjnych i layoutów, zapewniając spójne doświadczenie zarówno dla nowych, jak i aktywnych użytkowników. Kluczowe aspekty to:

- Oddzielne layouty (publiczny i chroniony) dopasowane do potrzeb różnych grup użytkowników.
- Globalna nawigacja z górnym menu dla widoków publicznych oraz sidebar dla widoków chronionych.
- Intuicyjne przełączanie między trybami generowania fiszek (YouTube vs. tekst) za pomocą tabów, wzbogacone animacjami.
- Moduł edycji fiszek implementowany w formie modalu ze spójną walidacją, licznikiem znaków i alertami inline.
- Korzystanie ze standardowych komponentów shadcn/ui, skeleton screens i loaderów, oraz wykorzystanie mechanizmów Next.js (server actions, cache) do uproszczenia zarządzania stanem.

## 2. Lista widoków

### Widoki publiczne

1. **Landing Page**

   - **Ścieżka widoku:** `/`
   - **Główny cel:** Przedstawienie oferty aplikacji i jej głównych funkcjonalności, zachęcenie do rejestracji lub logowania.
   - **Kluczowe informacje:** Krótkie wprowadzenie, prezentacja zalet, przyciski kierujące do logowania i rejestracji.
   - **Kluczowe komponenty:** Nagłówek, sekcja informacyjna, przyciski call-to-action.
   - **Uwagi UX/dostępności:** Responsywny design, czytelna typografia, wsparcie dla technologii asystujących (a11y).

2. **Login**

   - **Ścieżka widoku:** `/login`
   - **Główny cel:** Umożliwienie użytkownikom logowania do systemu.
   - **Kluczowe informacje:** Formularz logowania, komunikaty błędów przy niepoprawnych danych.
   - **Kluczowe komponenty:** Formularz, pola tekstowe, przycisk logowania.
   - **Uwagi UX/dostępności:** Natychmiastowa walidacja, czytelne etykiety pól, możliwość nawigacji klawiaturowej.

3. **Signup**
   - **Ścieżka widoku:** `/signup`
   - **Główny cel:** Rejestracja nowych użytkowników w systemie.
   - **Kluczowe informacje:** Formularz rejestracyjny, informacje o polityce prywatności.
   - **Kluczowe komponenty:** Formularz, pola wejściowe, przycisk rejestracji.
   - **Uwagi UX/dostępności:** Jasne komunikaty walidacyjne, prosty i intuicyjny interfejs.

### Widoki chronione (dla zalogowanych użytkowników)

4. **Dashboard**

   - **Ścieżka widoku:** `/dashboard`
   - **Główny cel:** Umożliwienie generowania fiszek poprzez wprowadzenie YouTube linku lub tekstu przez AI oraz ich rewizję (zaakceptuj, edytuj lub odrzuć).
   - **Kluczowe informacje:** Formularz generowania z opcją wyboru trybu (YouTube vs. tekst), lista propozycji fiszek wygenerowanych przez AI, wskaźnik postępu operacji, alerty inline oraz skeleton screens do ładowania danych.
   - **Kluczowe komponenty:** Formularz generowania, przełączniki (taby) z animacjami, przycisk "Generate", lista fiszek, przyciski akcji (zapisz wszystkie, zapisz zaakceptowane), licznik znaków, alerty inline, skeleton screens.
   - **Uwagi UX/dostępności:** Płynne przejścia między trybami, wyraźne komunikaty o walidacji błędów, responsywny design.

5. **Flashcards List (My flashcards)**

   - **Ścieżka widoku:** `/flashcards`
   - **Główny cel:** Prezentacja wygenerowanych propozycji fiszek oraz umożliwienie zarządzania nimi.
   - **Kluczowe informacje:** Lista fiszek zaakceptowanych przez uzytkownika i podgląd treści fiszki (przód/tył) i poziom CEFR.
   - **Kluczowe komponenty:** Komponent listy, karty fiszek.
   - **Uwagi UX/dostępności:** Jasne ikony i etykiety, wsparcie dla obsługi klawiaturą oraz czytników ekranu.

6. **Flashcard Edit Modal**

   - **Ścieżka widoku:** (Modal wywoływany z widoku listy fiszek, bez dedykowanego routingu)
   - **Główny cel:** Umożliwienie edycji zawartości fiszki w przyjaznym interfejsie modalnym.
   - **Kluczowe informacje:** Formularz edycji z predefiniowaną walidacją, licznik znaków, przyciski "Zapisz" oraz "Wróć".
   - **Kluczowe komponenty:** Modal, formularz, pola wejściowe, komunikaty walidacyjne.
   - **Uwagi UX/dostępności:** Możliwość zamknięcia modalu za pomocą przycisku lub klawisza ESC, responsywne projektowanie, zgodność z zasadami a11y.

7. **Flashcard Create Modal**

   - **Ścieżka widoku:** (Modal wywoływany z poziomu Dashboard oraz Flashcards List, bez dedykowanego routingu)
   - **Główny cel:** Umożliwienie tworzenia nowej fiszki przez ręczne wprowadzenie danych.
   - **Kluczowe informacje:** Formularz tworzenia fiszki z predefiniowaną walidacją dla pól "front" (max 200 znaków) i "back" (max 500 znaków), licznik znaków, przyciski "Utwórz" oraz "Anuluj".
   - **Kluczowe komponenty:** Modal, formularz, pola wejściowe, komunikaty walidacyjne.
   - **Uwagi UX/dostępności:** Możliwość zamknięcia modalu za pomocą przycisku lub klawisza ESC, responsywny design, dostępność dla użytkowników korzystających z technologii asystujących.

8. **Learning Session (Opcjonalnie)**

   - **Ścieżka widoku:** `/learning-session`
   - **Główny cel:** Umożliwienie efektywnej nauki fiszek przy zastosowaniu algorytmu powtórek.
   - **Kluczowe informacje:** Prezentacja fiszki, przyciski do odkrywania tylnej strony i oceny fiszki, wskaźnik postępu oraz informacje zwrotne na temat nauki.
   - **Kluczowe komponenty:** Widok pojedynczej fiszki, przyciski interakcyjne, wskaźniki progresu.
   - **Uwagi UX/dostępności:** Intuicyjna obsługa, wyraźne informacje o postępie, wsparcie dla użytkowników korzystających z klawiatury.

9. **Profile**

   - **Ścieżka widoku:** `/profile`
   - **Główny cel:** Umożliwienie zarządzania informacjami o koncie użytkownika oraz ustawieniami i preferencjami.
   - **Kluczowe informacje:** Sekcja umożliwiająca edycję danych profilu, zmianę hasła, ustawienia prywatności i preferencji.
   - **Kluczowe komponenty:** Formularze, pola wejściowe, przyciski akcji, panele nawigacyjne wewnątrz sekcji profilu.
   - **Uwagi UX/dostępności:** Intuicyjny interfejs, walidacja formularzy, responsywny design, wsparcie dla technologii asystujących (a11y).

## 3. Mapa podróży użytkownika

1. Użytkownik odwiedza Landing Page, gdzie zapoznaje się z możliwością korzystania z aplikacji TedCards.
2. Z Landing Page użytkownik wybiera opcję logowania lub rejestracji, przechodząc do widoku Login/Signup.
3. Po poprawnym zalogowaniu użytkownik trafia do Dashboard, gdzie generuje fiszki wprowadzając dane (link z YouTube lub tekst) przy użyciu dostępnych przełączników (taby).
4. Po zakończeniu procesu generowania, użytkownik przegląda wygenerowane fiszki w sekcji Flashcards List i wykonuje akcje: zaakceptuj, edytuj, usuń. Następnie moze zapisac wszystkie wygenerowane fiszki lub tylko zaakceptowane.
5. Dodatkowo, z poziomu Dashboard lub Flashcards List, użytkownik może wywołać Flashcard Create Modal, aby dodać nową fiszkę ręcznie.
6. Opcjonalnie użytkownik przechodzi do Learning Session, aby uczyć się zatwierdzonych fiszek według zaprojektowanego algorytmu powtórek.
7. Użytkownik może przejść do sekcji Profile, aby zarządzać informacjami o koncie i ustawieniami.

## 4. Układ i struktura nawigacji

- **Widoki publiczne:** Korzystają z globalnego górnego menu, które zawiera linki do Home, Login i Signup. Nawigacja jest prosta, intuicyjna i responsywna.
- **Widoki chronione:** Po zalogowaniu, użytkownik korzysta z bocznego sidebaru, który umożliwia przełączanie między Dashboard, Flashcards List, Learning Session, Profile.
- **Nawigacja kontekstowa:** W widoku Dashboard dostępne są przyciski umożliwiające wywołanie Flashcard Create Modal, a także przełączanie między trybem generowania (poprzez taby). Dodatkowo, modale (do edycji i tworzenia fiszek) umożliwiają powrót do listy bez utraty kontekstu.
- **Feedback wizualny:** W całej aplikacji stosuje się skeleton screens, loadery i inline alerty, które informują użytkownika o stanie operacji oraz błędach (np. walidacja formularza).

## 5. Kluczowe komponenty

- **Layout Publiczny i Chroniony:** Oddzielne struktury dla widoków niezalogowanych i zalogowanych, umożliwiające modularną organizację interfejsu.
- **TopBar i Sidebar:** Globalne komponenty nawigacyjne, które umożliwiają płynną nawigację między sekcjami aplikacji.
- **Tabs Component:** Wykorzystywany w widoku Flashcards Generation do przełączania trybów generowania (YouTube vs. tekst) z obsługą animacji.
- **Flashcard Edit Modal:** Uniwersalny komponent modal umożliwiający edycję fiszek, wyposażony w walidację pól, licznik znaków oraz komunikaty inline.
- **Flashcards List Component:** Komponent prezentujący listę fiszek z funkcjami zatwierdzania, edycji i usuwania oraz wizualizacją poziomu CEFR.
- **Komponenty formularzy:** Reużywalne pola wejściowe z mechanizmami walidacji, licznikami znaków i natychmiastowym feedbackiem użytkownika.
- **Skeleton Screens i Loadery:** Komponenty zapewniające informację o postępie akcji i ładowaniu danych, poprawiające ogólne doświadczenie użytkownika.
  s
