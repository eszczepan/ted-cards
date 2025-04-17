# Dokument wymagań produktu (PRD) - TedCards

## 1. Przegląd produktu

TedCards to aplikacja webowa, której kluczową funkcjonalnością jest automatyczne generowanie fiszek edukacyjnych z napisów pobranych z filmów YouTube. System integruje mechanizm przetwarzania napisów oraz generowania treści fiszek za pomocą AI, umożliwiając użytkownikom szybką naukę nowych słówek w kontekście zdań i przykładów. Aplikacja obsługuje języki polski i angielski. Ponadto, użytkownik ma możliwość manualnego tworzenia fiszek, co pozwala na pełną personalizację nauki.

## 2. Problem użytkownika

Użytkownicy często napotykają na problem czasochłonności i dezorientacji przy ręcznym tworzeniu wysokiej jakości fiszek edukacyjnych. Proces ten wymaga starannego doboru treści, poprawnego formatu oraz zapewnienia przykładu użycia słów, co znacząco obciąża czas i energię. Dodatkowo, brak automatyzacji w generowaniu treści powoduje, że nauka języka staje się mniej efektywna i mało atrakcyjna.

## 3. Wymagania funkcjonalne

1. Automatyczne generowanie fiszek:

- Pobieranie napisów z YouTube z limitem do 15000 znaków oraz walidacja długości.
- Automatyczne generowanie fiszek przez AI na podstawie pobranych napisów, przy czym:
  - Pole "przód" zawiera słowo w znanym języku (do 200 znaków).
  - Pole "tył" zawiera rozbudowaną odpowiedź z przykładem użycia (do 500 znaków).
- Automatyczna ocena poziomu CEFR dla każdej fiszki z możliwością edycji przez użytkownika poprzez dropdown (opcje: A1, A2, B1, B2, C1, C2).
- Interfejs umożliwiający interakcję z generowanymi fiszkami poprzez przyciski "zaakceptuj", "edytuj" oraz "odrzuć".
- Bulkowy zapis decyzji użytkownika – zaakceptowane fiszki trafiają do bazy danych.
- Rejestrowanie logów statusów akceptacji fiszek w dedykowanej tabeli bazy danych.
- Wielowarstwowa walidacja danych (frontend, backend, baza) z informacyjnymi alertami w przypadku błędów.
- Fiszki mogą być generowane z dwóch źródeł: YouTube link lub tekst wklejony przez użytkownika.

2. Ręcznie tworzenie i zarządzanie fiszkami:

- Możliwość ręcznego tworzenia fiszek przez formularz
- Wyświetlanie wszystkich fiszek uzytkownika w ramach widoku "Moje fiszki".
- Opcje edycji i usuwania istniejących fiszek

3. Podstawowy system uwierzytelniania i kont uzytkowników:

- Rejestracja i logowanie
- Podstawowe operacje na koncie użytkownika, takie jak edycja hasła oraz usuwanie konta.
- Usuwanie fiszek powiązanych z usuwanym kontem

4. Integracja z algorytmem powtórek:

- Zapewnienie mechanizmu przypisywania fiszek do harmonogramu powtórek
- Brak dodatkowych metadanych i zaawansowanych funkcji powiadomień w MVP

5. Statystki generowania fiszek:

- Zbieranie informacji o tym, ile fiszek wygenerowanych przez AI zostalo zaakceptowanych przez uztykownika

6. Wymagania prawne i ograniczenia:

- Dane osobowe uzytkownikow i fiszek przechowywane zgodnie z RODO.
- Prawo do wglądu i usunięcia danych (konto wraz z fiszkami) na wniosek uzytkownika.

## 4. Granice produktu

- Aplikacja nie wdraża zaawansowanych algorytmów powtórek na wzór SuperMemo czy Anki (korzystamy z gotowego rozwiazania, biblioteka open source).
- Nie przewidziano śledzenia postępów, statystyk ani dziennych streaków.
- Importowanie wielu formatów (PDF, DOCX, itp.) nie jest w zakresie MVP.
- Nie wspieramy współdzielenia zestawów fiszek między użytkownikami.
- Brak personalizacji tematycznej nauki (np. egzamin, specjalistyczna terminologia).
- Aplikacja będzie dostępna wyłącznie jako rozwiązanie webowe, bez natywnych aplikacji mobilnych.
- Synchronizacja danych pomiędzy urządzeniami nie jest priorytetem na tym etapie.

## 5. Historyjki użytkowników

ID: US-001
Tytuł: Automatyczne generowanie fiszek z YouTube przy uzyciu AI
Opis: Jako użytkownik, chcę wprowadzić link do filmu na YouTube, aby system pobrał napisy (do 15000 znaków) i wygenerował z nich fiszki, zachowując ograniczenia znaków oraz generując poziom CEFR.
Kryteria akceptacji:

- System pobiera napisy z podanego filmu do limitu 15000 znaków.
- System komunikuje sie z API modelu LLM i generuje fiszki, gdzie pole "przód" nie przekracza 200 znaków, a "tył" 500 znaków.
- Automatycznie generowany poziom CEFR.
- Wyswietlana jest lista wygenerowanych propozycji fiszek do akceptacji przez uzytkownika
- W przypadku problemow z API lub braku odpowiedzi modelu uzytkownik zobaczy stosowny komunikat o bledzie

ID: US-002
Tytuł: Ręczne tworzenie fiszek
Opis: Jako użytkownik, chce mieć możliwość ręcznego tworzenia fiszek, aby móc dodać własne treści.
Kryteria akceptacji:

- Interfejs pozwala na wprowadzenie danych dla pól "przód" (max 200 znaków) i "tył" (max 500 znaków).
- Walidacja danych zgłasza błąd przy przekroczeniu limitu znaków lub nieprawidłowego formatu.

ID: US-005
Tytuł: Przegląd i zatwierdzanie propozycji fiszek
Opis: Jako zalogowany użytkownik chcę móc przeglądać wygenerowane fiszki i decydować, które z nich chcę dodać do mojego zestawu, aby zachować tylko przydatne pytania i odpowiedzi.
Kryteria akceptacji:

- Lista wygenerowanych fiszek jest wyświetlana pod formularzem generowania.
- Przy każdej fiszce znajduje się przycisk pozwalający na jej zatwierdzenie, edycję lub odrzucenie.
- Po zatwierdzeniu wybranych fiszek użytkownik może kliknąć przycisk zapisu i dodać je do bazy danych.

ID: US-004
Tytuł: Akceptacja i odrzucanie wygenerowanych fiszek przez AI
Opis: Jako użytkownik, chcę mieć możliwość akceptacji, edycji lub odrzucenia generowanych fiszek za pomocą dedykowanych przycisków, aby odfiltrować nieodpowiednie propozycje.
Kryteria akceptacji:

- Lista wygenerowanych fiszek jest wyswietlana pod formularzem generowania
- Przy kazdej fiszce znajduja sie przyciski "zaakceptuj", "edytuj" oraz "odrzuć".
- Decyzje użytkownika są zbierane i zapisane w formie bulk, przy czym zaakceptowane fiszki trafiają do bazy danych.

ID: US-005
Tytuł: Bulkowy zapis decyzji
Opis: Jako użytkownik, chcę aby moje decyzje dotyczące fiszek (zaakceptowanie, edycja oraz odrzucenie) były zapisywane zbiorczo, aby usprawnić proces przetwarzania danych.
Kryteria akceptacji:

- System umożliwia zbiorczy zapis decyzji.
- Akceptowane fiszki są poprawnie rejestrowane w bazie danych, a logi akceptacji są przechowywane w dedykowanej tabeli.

ID: US-006
Tytuł: Edycja poziomu CEFR
Opis: Jako użytkownik, chcę móc zmieniać automatycznie przydzielony poziom CEFR dla każdej fiszki za pomocą kontrolki dropdown, aby dostosować ocenę do mojej wiedzy.
Kryteria akceptacji:

- Dropdown zawiera opcje: A1, A2, B1, B2, C1, C2.
- Zmiana poziomu jest natychmiast widoczna i zapisywana w danych fiszki.

ID: US-007
Tytuł: Rejestracja konta
Opis: Jako nowy użytkownik chcę się zarejestrować, aby mieć dostęp do własnych fiszek i móc korzystać z generowania fiszek przez AI.
Kryteria akceptacji:

- Formularz rejestracyjny zawiera pola na adres e-mail i hasło.
- Po poprawnym wypełnieniu formularza i weryfikacji danych konto jest aktywowane.
- Użytkownik otrzymuje potwierdzenie pomyślnej rejestracji i zostaje zalogowany.

ID: US-008
Tytuł: Logowanie do aplikacji
Opis: Jako zarejestrowany użytkownik chcę móc się zalogować, aby mieć dostęp do moich fiszek i historii generowania.
Kryteria akceptacji:

- Po podaniu prawidłowych danych logowania użytkownik zostaje przekierowany do widoku generowania fiszek.
- Błędne dane logowania wyświetlają komunikat o nieprawidłowych danych.
- Dane dotyczące logowania przechowywane są w bezpieczny sposób.

ID: US-009
Tytuł: Zarządzanie kontem użytkownika
Opis: Jako użytkownik, chcę móc edytować swoje hasło oraz usuwać konto, aby mieć pełną kontrolę nad swoimi danymi.
Kryteria akceptacji:

- Interfejs pozwala na zmianę hasła z odpowiednią weryfikacją.
- Użytkownik może usunąć swoje konto, a system usuwa powiązane dane.

ID: US-010
Tytuł: Sesja nauki z algorytmem powtorek
Opis: Jako zalogowany uzytkownik chce, aby dodane fiszki byly dostepne w widoku "Sesja nauki" opartym na zewnetrznym algorytmie, aby moc efektywnie sie uczyć (spaced repetition).
Kryteria akceptacji:

- Na widoku "Sesja nauki" algorytm przygotowuje dla mnie sesję nauki fiszek
- Na start wyświetlany jest przód fiszki, poprzez interakcję uzytkownik wyświetla jej tyl
- Uzytkownik ocenia zgodnie z oczekiwaniami algorytmu na ile przyswoil fiszke
- Nastepnie algorytm pokazuje kolejną fiszkę w ramach sesji nauki

US-010
Tytuł: Bezpieczny dostęp i autoryzacja
Opis: Jako zalogowany użytkownik chcę mieć pewność, że moje fiszki nie są dostępne dla innych użytkowników, aby zachować prywatność i bezpieczeństwo danych.
Kryteria akceptacji:

- Tylko zalogowany użytkownik może wyświetlać, edytować i usuwać swoje fiszki.
- Nie ma dostępu do fiszek innych użytkowników ani możliwości współdzielenia.

ID: US-011
Tytuł: Usuwanie fiszek
Opis: Jako zalogowany użytkownik chcę usuwać zbędne fiszki, aby zachować porządek w moim zestawie.
Kryteria akceptacji:

- Przy każdej fiszce na liście (w widoku "Moje fiszki") widoczna jest opcja usunięcia.
- Po wybraniu usuwania użytkownik musi potwierdzić operację, zanim fiszka zostanie trwale usunięta.
- Fiszki zostają trwale usunięte z bazy danych po potwierdzeniu.

ID: US-012
Tytuł: Automatyczne generowanie fiszek z wklejonego tekst przy uzyciu AI
Opis: Jako użytkownik, chcę wkleić tekst, aby system wygenerował z niego fiszki, zachowując ograniczenia znaków oraz generując poziom CEFR.
Kryteria akceptacji:

- System komunikuje sie z API modelu LLM i generuje fiszki
- Automatycznie generowany poziom CEFR.
- Wyswietlana jest lista wygenerowanych propozycji fiszek do akceptacji przez uzytkownika

## 6. Metryki sukcesu

1. Efektywność generowania fiszek:
   - 75% wygenerowanych przez AI fiszek jest akceptowanych przez użytkownika.
   - Użytkownicy tworzą co najmniej 75% fiszek z wykorzystaniem AI (w stosunku do wszystkich nowo dodanych fiszek).
2. Zaangażowanie:
   - Monitorowanie liczby wygenerowanych fiszek i porównanie z liczbą zatwierdzonych do analizy jakości i użyteczności.
