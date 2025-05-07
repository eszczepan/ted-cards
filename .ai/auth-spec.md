# Specyfikacja Architektury Modułu Autentykacji - TedCards

## 1. Wprowadzenie

Niniejszy dokument opisuje architekturę modułu rejestracji, logowania, wylogowywania oraz odzyskiwania hasła dla aplikacji TedCards. Specyfikacja bazuje na wymaganiach z dokumentu PRD (US-007, US-008, US-013), tech-stacku projektu oraz najlepszych praktykach integracji Supabase z Next.js App Router.

## 2. Architektura Interfejsu Użytkownika (Frontend)

### 2.1. Strony (Routes)

Wszystkie strony związane z autentykacją będą znajdować się w katalogu `app/(public)/`, aby były dostępne dla niezalogowanych użytkowników. Strony chronione (np. dashboard) będą automatycznie przekierowywać do strony logowania, jeśli użytkownik nie jest uwierzytelniony (obsługa przez middleware).

- **`app/(public)/login/page.tsx`**: Strona logowania.
  - Odpowiedzialność: Wyświetla formularz logowania, obsługuje proces logowania użytkownika.
  - Komponenty: `LoginForm`.
- **`app/(public)/signup/page.tsx`**: Strona rejestracji.
  - Odpowiedzialność: Wyświetla formularz rejestracji, obsługuje proces tworzenia nowego konta.
  - Komponenty: `SignupForm`.
- **`app/(public)/reset-password/page.tsx`**: Strona inicjowania procesu odzyskiwania hasła.
  - Odpowiedzialność: Wyświetla formularz do wprowadzenia adresu email w celu wysłania linku resetującego hasło.
  - Komponenty: `ResetPasswordRequestForm`.
- **`app/(public)/update-password/page.tsx`**: Strona do ustawiania nowego hasła po kliknięciu w link resetujący.
  - Odpowiedzialność: Wyświetla formularz do wprowadzenia nowego hasła. Dostępna tylko przez specjalny link z tokenem lub po weryfikacji tokena przez `auth/confirm` i przekierowaniu.
  - Komponenty: `UpdatePasswordForm`.
- **`app/auth/confirm/route.ts`**: Endpoint (Route Handler) do potwierdzania adresu email po rejestracji oraz obsługi callbacku po kliknięciu linku resetującego hasło (weryfikacja tokenu OTP).
  - Odpowiedzialność: Weryfikuje token (`token_hash`) i typ (`type`) z linku email. Dla rejestracji aktywuje konto i loguje użytkownika. Dla resetu hasła, po pomyślnej weryfikacji tokena, przekierowuje na stronę `app/(public)/update-password/page.tsx` (Supabase może ustawić tymczasową sesję pozwalającą na zmianę hasła).

### 2.2. Komponenty UI

Komponenty UI będą umieszczone w katalogu `./components/`. Komponenty Shadcn/ui będą wykorzystywane do budowy formularzy i elementów interfejsu.

- **`components/shared/AuthFormWrapper.tsx`**: (Nowy) Komponent opakowujący formularze autentykacji, zapewniający spójny wygląd (np. tytuł, logo aplikacji, linki pomocnicze typu "Nie masz konta? Zarejestruj się").
- **`components/shared/LoginForm.tsx`**: (Nowy)
  - Odpowiedzialność: Formularz logowania z polami na email i hasło. Wykorzystuje Server Action do komunikacji z backendem.
  - Pola: Email (`Input`), Hasło (`Input type="password"`).
  - Przyciski: "Zaloguj się" (`Button`).
  - Linki: "Zarejestruj się" (`Link` z Next.js), "Zapomniałeś hasła?" (`Link` z Next.js).
- **`components/shared/SignupForm.tsx`**: (Nowy)
  - Odpowiedzialność: Formularz rejestracji z polami na email, hasło i potwierdzenie hasła. Wykorzystuje Server Action.
  - Pola: Email (`Input`), Hasło (`Input type="password"`), Potwierdź Hasło (`Input type="password"`).
  - Przyciski: "Zarejestruj się" (`Button`).
  - Linki: "Masz już konto? Zaloguj się" (`Link` z Next.js).
- **`components/shared/ResetPasswordRequestForm.tsx`**: (Nowy)
  - Odpowiedzialność: Formularz do wysyłania prośby o reset hasła. Wykorzystuje Server Action.
  - Pola: Email (`Input`).
  - Przyciski: "Wyślij link do resetowania hasła" (`Button`).
  - Linki: "Wróć do logowania" (`Link` z Next.js).
- **`components/shared/UpdatePasswordForm.tsx`**: (Nowy)
  - Odpowiedzialność: Formularz do ustawiania nowego hasła. Wykorzystuje Server Action. Strona powinna być dostępna po weryfikacji tokenu resetującego.
  - Pola: Nowe Hasło (`Input type="password"`), Potwierdź Nowe Hasło (`Input type="password"`).
  - Przyciski: "Ustaw nowe hasło" (`Button`).
- **`components/layout/Sidebar.tsx`**: (Modyfikacja)
  - Dodanie przycisku "Wyloguj się" (`Button`). Widoczny tylko dla zalogowanych użytkowników. Kliknięcie wywołuje Server Action do wylogowania.
- **`components/layout/Header.tsx`**: (Modyfikacja, jeśli istnieje i jest relevantne)
  - Może wyświetlać status zalogowania (np. email użytkownika) lub linki do logowania/rejestracji dla niezalogowanych użytkowników, w zależności od projektu UI.

### 2.3. Layouty

- **`app/(public)/layout.tsx`**: (Modyfikacja istniejącego) Layout dla stron publicznych (logowanie, rejestracja, reset hasła). Prosty layout, bez elementów wymagających autentykacji (np. główny sidebar użytkownika).
- **`app/dashboard/layout.tsx`**: (Istniejący) Layout dla stron chronionych. Powinien zawierać elementy widoczne dla zalogowanego użytkownika (np. Sidebar z opcją wylogowania). Middleware będzie chronić dostęp do tego layoutu i jego podstron.

### 2.4. Walidacja i Komunikaty Błędów (Frontend)

- Walidacja po stronie klienta przy użyciu biblioteki Zod zintegrowanej z formularzami React Hook Form i komponentami Shadcn/ui. Reguły walidacji: wymagane pola, poprawny format email, minimalna długość hasła, zgodność haseł.
- Komunikaty o błędach walidacji wyświetlane bezpośrednio przy odpowiednich polach formularza.
- Globalne komunikaty (np. "Nieprawidłowy email lub hasło", "Użytkownik o tym adresie email już istnieje", "Wysłano link do resetowania hasła", "Link potwierdzający został wysłany na Twój adres email.") wyświetlane za pomocą komponentów typu "Toast" lub "Alert" (z Shadcn/ui), inicjowane po odpowiedzi z Server Action.

### 2.5. Scenariusze Użytkownika

1.  **Rejestracja:**
    - Użytkownik przechodzi na `/signup`.
    - Wypełnia formularz (`SignupForm`): email, hasło, potwierdzenie hasła.
    - Walidacja frontendowa (Zod).
    - Klika "Zarejestruj się".
    - Wywoływane jest Server Action `signup` (z `app/(public)/signup/actions.ts`).
    - Jeśli Server Action zwraca błąd (np. email zajęty), wyświetlany jest komunikat błędu na UI.
    - Jeśli sukces: użytkownik otrzymuje email z linkiem potwierdzającym (skierowanym do `app/auth/confirm/route.ts`). Na UI wyświetlana jest informacja o konieczności potwierdzenia emaila.
    - Po kliknięciu linku w emailu: `app/auth/confirm/route.ts` weryfikuje token, aktywuje użytkownika. Zgodnie z PRD, użytkownik powinien zostać zalogowany i przekierowany do `/dashboard`.
2.  **Logowanie:**
    - Użytkownik przechodzi na `/login`.
    - Wypełnia formularz (`LoginForm`): email i hasło.
    - Walidacja frontendowa (Zod).
    - Klika "Zaloguj się".
    - Wywoływane jest Server Action `login` (z `app/(public)/login/actions.ts`).
    - Jeśli Server Action zwraca błąd (np. złe dane, email niepotwierdzony), wyświetlany jest komunikat błędu na UI.
    - Jeśli sukces: sesja jest tworzona, middleware ją obsługuje, użytkownik jest przekierowywany do `/dashboard`.
3.  **Wylogowanie:**
    - Zalogowany użytkownik klika "Wyloguj się" w `Sidebar.tsx`.
    - Wywoływane jest Server Action `logout`.
    - Sesja jest usuwana, użytkownik jest przekierowywany na stronę główną (`/`) lub stronę logowania (`/login`).
4.  **Odzyskiwanie hasła (Żądanie):**
    - Użytkownik na `/login` klika link "Zapomniałeś hasła?".
    - Jest przekierowywany na `/reset-password`.
    - Wypełnia formularz (`ResetPasswordRequestForm`): wpisuje email.
    - Klika "Wyślij link do resetowania hasła".
    - Wywoływane jest Server Action `requestPasswordReset` (z `app/(public)/reset-password/actions.ts`).
    - Jeśli sukces: wyświetlany jest komunikat "Jeśli konto istnieje, wysłano link na podany email".
    - Jeśli błąd (np. błąd serwera): wyświetlany jest ogólny komunikat błędu.
5.  **Odzyskiwanie hasła (Ustawienie nowego hasła):**
    - Użytkownik klika link resetujący w emailu. Link prowadzi do `app/auth/confirm/route.ts` z `type=recovery`.
    - `app/auth/confirm/route.ts` weryfikuje token. Jeśli poprawny, Supabase może ustawić tymczasową sesję lub wygenerować kod, a następnie przekierowuje użytkownika na stronę `/update-password`.
    - Na stronie `/update-password` użytkownik wypełnia formularz (`UpdatePasswordForm`): nowe hasło i jego potwierdzenie.
    - Klika "Ustaw nowe hasło".
    - Wywoływane jest Server Action `updatePassword` (z `app/(public)/update-password/actions.ts`).
    - Jeśli Server Action zwraca błąd (np. hasła niezgodne, błąd Supabase), wyświetlany jest komunikat błędu.
    - Jeśli sukces: hasło zostaje zmienione, użytkownik jest przekierowany do `/login` z komunikatem o pomyślnej zmianie hasła.

## 3. Logika Backendowa (Next.js Server Actions & Route Handlers)

Logika backendowa będzie realizowana głównie przez Next.js Server Actions. Route Handlers posłużą do obsługi callbacków od Supabase.

### 3.1. Server Actions

Pliki `actions.ts` będą umieszczone obok stron, które ich używają lub w centralnym miejscu, jeśli są współdzielone.

- **`app/(public)/signup/actions.ts`**:
  - `async function signup(formData: FormData)`:
    - Pobiera `email`, `password` z `formData`.
    - Waliduje dane używając schematu Zod (email, min. dł. hasła). Sprawdza zgodność `password` i `confirmPassword` (jeśli `confirmPassword` jest częścią `formData`).
    - Tworzy klienta Supabase dla Server Actions (`import { createClient } from '@/lib/utils/supabase/server'`).
    - Wywołuje `supabase.auth.signUp({ email, password, options: { emailRedirectTo: '${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm' } })`.
    - Zwraca obiekt `{ error }` lub `{ data }` do UI.
- **`app/(public)/login/actions.ts`**:
  - `async function login(formData: FormData)`:
    - Pobiera `email`, `password` z `formData`.
    - Waliduje dane (Zod).
    - Tworzy klienta Supabase dla Server Actions.
    - Wywołuje `supabase.auth.signInWithPassword({ email, password })`.
    - Jeśli sukces, Supabase ustawi ciasteczka sesji. Server Action może użyć `redirect('/')` lub `redirect('/dashboard')` z `next/navigation`.
    - Zwraca `{ error }` do UI w przypadku niepowodzenia.
- **`app/(public)/reset-password/actions.ts`**:
  - `async function requestPasswordReset(formData: FormData)`:
    - Pobiera `email` z `formData`.
    - Waliduje (Zod).
    - Tworzy klienta Supabase dla Server Actions.
    - Wywołuje `supabase.auth.resetPasswordForEmail(email, { redirectTo: '${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm?next=/update-password' })`. Parametr `next` w `redirectTo` może być użyty przez `auth/confirm` do przekierowania po pomyślnej weryfikacji tokenu.
    - Zwraca `{ error }` lub informację o sukcesie.
- **`app/(public)/update-password/actions.ts`**:
  - `async function updatePassword(formData: FormData)`:
    - Pobiera `newPassword`, `confirmNewPassword` z `formData`.
    - Waliduje (Zod), sprawdza zgodność haseł.
    - Tworzy klienta Supabase dla Server Actions.
    - Wywołuje `supabase.auth.updateUser({ password: newPassword })`. Ta operacja powiedzie się, jeśli użytkownik ma aktywną sesję (np. po weryfikacji tokenu OTP przez `auth/confirm`).
    - Zwraca `{ error }`. W przypadku sukcesu, inicjuje `redirect('/login')`.
- **Akcja wylogowania (np. `app/actions/auth.ts` lub w `components/layout/actions.ts`)**:
  - `async function logout()`:
    - Tworzy klienta Supabase dla Server Actions.
    - Wywołuje `supabase.auth.signOut()`.
    - Inicjuje `redirect('/login')`.

### 3.2. Route Handlers

- **`app/auth/confirm/route.ts`**:
  - `export async function GET(request: NextRequest)`:
    - Pobiera `token_hash` i `type` z `request.nextUrl.searchParams`.
    - Tworzy klienta Supabase dla Route Handlers.
    - Wywołuje `await supabase.auth.verifyOtp({ token_hash, type: type as EmailOtpType })`.
    - Jeśli błąd: przekierowuje na stronę błędu (np. `/error` lub `/login` z komunikatem błędu w query params).
    - Jeśli sukces:
      - Dla `type='signup'`: Użytkownik potwierdzony. Przekierowuje do `/dashboard`.
      - Dla `type='recovery'`: Potwierdzenie żądania resetu. Przekierowuje na `/update-password` (parametr `next` z `redirectTo` w `resetPasswordForEmail` może być tu użyty). Supabase po `verifyOtp` dla `recovery` powinno umożliwić `updateUser`.
    - Używa `redirect()` z `next/navigation`.

### 3.3. Walidacja Danych (Backend)

- Biblioteka Zod będzie używana do walidacji wszystkich danych wejściowych w Server Actions i Route Handlers przed interakcją z Supabase.
- Schematy Zod będą definiować oczekiwane typy, formaty (np. email), minimalne/maksymalne długości oraz inne reguły (np. zgodność haseł).

### 3.4. Obsługa Wyjątków

- Wszystkie wywołania API Supabase w Server Actions i Route Handlers będą opakowane w bloki `try...catch` lub będą obsługiwać obiekt błędu zwracany przez Supabase SDK.
- Błędy będą logowane po stronie serwera (np. przy użyciu `console.error`).
- Do użytkownika będą zwracane generyczne, przyjazne komunikaty błędów lub specyficzne, jeśli są bezpieczne do wyświetlenia (np. "Email jest już zajęty").

### 3.5. Renderowanie Stron (Server-Side)

- Strony publiczne (`/login`, `/signup`, etc.) będą renderowane jako Server Components. Mogą one sprawdzić, czy użytkownik jest już zalogowany (używając klienta Supabase dla serwera) i w razie potrzeby przekierować go do `/dashboard` (np. w `middleware.ts` lub na początku komponentu strony).
- Strony chronione (`/dashboard` i inne) będą Server Components. Będą używać `createClient` (server) i `supabase.auth.getUser()` do pobrania danych użytkownika. Jeśli użytkownik nie jest zalogowany lub wystąpi błąd, nastąpi przekierowanie do `/login` (realizowane głównie przez middleware).

## 4. System Autentykacji (Supabase + Next.js SSR)

Integracja z Supabase będzie następować zgodnie z oficjalną dokumentacją dla Next.js App Router (`@supabase/ssr` package).

### 4.1. Konfiguracja Supabase

- Zmienne środowiskowe `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY` w pliku `.env.local`.
- Należy również dodać `NEXT_PUBLIC_BASE_URL` (np. `http://localhost:3000` dla dewelopmentu) do `.env.local` i używać go przy konstruowaniu `emailRedirectTo` i `redirectTo`.
- Konfiguracja szablonów email w panelu Supabase (Auth -> Templates):
  - **Confirm signup:** Zmień `{{ .ConfirmationURL }}` na `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`.
  - **Reset password:** Zmień `{{ .ConfirmationURL }}` na `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`. (Supabase używa `verifyOtp` dla obu).
- W panelu Supabase (Auth -> URL Configuration) ustawić "Site URL" na `NEXT_PUBLIC_BASE_URL`.

### 4.2. Klienty Supabase

- **`lib/utils/supabase/client.ts`**: (Dla Client Components)

  ```typescript
  // lib/utils/supabase/client.ts
  import { createBrowserClient } from "@supabase/ssr";

  export function createClient() {
    return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }
  ```

- **`lib/utils/supabase/server.ts`**: (Dla Server Components, Actions, Route Handlers)

  ```typescript
  // lib/utils/supabase/server.ts
  import { createServerClient, type CookieOptions } from "@supabase/ssr";
  import { cookies } from "next/headers";

  export function createClient() {
    const cookieStore = cookies();

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the set method is called from a Server Component, an error will be thrown
          // This can be ignored if you have middleware refreshing
          // user sessions.
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          // If the remove method is called from a Server Component, an error will be thrown
          // This can be ignored if you have middleware refreshing
          // user sessions.
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {}
        },
      },
    });
  }
  ```

### 4.3. Middleware

- **`middleware.ts`**: (Na poziomie roota projektu lub `./src`)

  - Odpowiedzialny za odświeżanie sesji użytkownika i ochronę tras.

  ```typescript
  // middleware.ts
  import { type NextRequest, NextResponse } from "next/server";
  import { createServerClient } from "@supabase/ssr"; // Użyjemy createServerClient bezpośrednio dla uproszczenia
  // lub dedykowanej funkcji updateSession, jeśli jest bardziej złożona

  export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Ochrona tras dashboardu
    if (!user && pathname.startsWith("/dashboard")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname); // Opcjonalnie: przekieruj z powrotem po zalogowaniu
      return NextResponse.redirect(loginUrl);
    }

    // Przekierowanie zalogowanych użytkowników ze stron publicznych auth
    if (user && (pathname === "/login" || pathname === "/signup" || pathname === "/reset-password")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Nie chronimy /update-password, bo dostęp jest kontrolowany przez token/sesję po kliknięciu linku

    return response;
  }

  export const config = {
    matcher: [
      /*
       * Dopasuj wszystkie ścieżki żądań oprócz tych zaczynających się od:
       * - _next/static (pliki statyczne)
       * - _next/image (pliki optymalizacji obrazów)
       * - favicon.ico (plik favicon)
       * - /auth/ (dla callbacków API, np. /auth/confirm)
       * - /api/ (jeśli masz inne endpointy API niechronione przez to middleware)
       * Możesz zmodyfikować ten wzorzec.
       */
      "/((?!_next/static|_next/image|favicon.ico|auth/.*|api/.*|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
  };
  ```

### 4.4. Bezpieczeństwo

- Zgodnie z dokumentacją Supabase, `supabase.auth.getUser()` będzie używane w Server Components, Server Actions i Route Handlers do bezpiecznej weryfikacji sesji użytkownika.
- Operacje wrażliwe (logowanie, rejestracja, zmiana hasła) będą realizowane przez Server Actions.
- Ciasteczka sesji zarządzane przez `@supabase/ssr` będą miały odpowiednie flagi bezpieczeństwa (np. `HttpOnly`, `Secure` w produkcji).
- Należy zadbać o poprawne ustawienie `Site URL` w Supabase i `NEXT_PUBLIC_BASE_URL` w aplikacji.

## 5. Struktura Katalogów (zmiany i dodatki)

- `app/(public)/login/page.tsx`
- `app/(public)/login/actions.ts`
- `app/(public)/signup/page.tsx`
- `app/(public)/signup/actions.ts`
- `app/(public)/reset-password/page.tsx`
- `app/(public)/reset-password/actions.ts`
- `app/(public)/update-password/page.tsx`
- `app/(public)/update-password/actions.ts`
- `app/(public)/layout.tsx` (nowy lub modyfikacja)
- `app/auth/confirm/route.ts`
- `app/actions/auth.ts` (opcjonalnie, dla np. akcji wylogowania, jeśli nie w `components/layout`)
- `components/shared/AuthFormWrapper.tsx`
- `components/shared/LoginForm.tsx`
- `components/shared/SignupForm.tsx`
- `components/shared/ResetPasswordRequestForm.tsx`
- `components/shared/UpdatePasswordForm.tsx`
- `lib/utils/supabase/client.ts`
- `lib/utils/supabase/server.ts`
- `middleware.ts` (w root lub `src/`)
- Modyfikacje w `components/layout/Sidebar.tsx` (dodanie przycisku wylogowania i logiki)
- `.env.local` (dodanie/weryfikacja zmiennych Supabase i `NEXT_PUBLIC_BASE_URL`)

## 6. Podsumowanie Kluczowych Wniosków

- Architektura w pełni wykorzystuje możliwości Next.js App Router (Server Components, Server Actions) oraz integrację z Supabase Auth przez pakiet `@supabase/ssr`.
- Jasno zdefiniowano przepływy użytkownika dla rejestracji (z potwierdzeniem email), logowania, wylogowania i odzyskiwania hasła.
- Middleware odgrywa kluczową rolę w zarządzaniu sesją i ochronie tras.
- Walidacja danych (Zod) jest stosowana zarówno na frontendzie (dla UX), jak i backendzie (dla bezpieczeństwa).
- Struktura katalogów jest zgodna z konwencjami Next.js i grupuje powiązane funkcjonalności.
- Rozwiązanie jest zgodne z wymaganiami PRD (US-007, US-008, US-013) i tech-stackiem projektu.
- Nacisk położono na bezpieczeństwo poprzez stosowanie zaleceń Supabase (np. użycie `getUser()` po stronie serwera).
