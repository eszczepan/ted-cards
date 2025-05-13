# TedCards

A web application that automatically generates educational flashcards from YouTube videos and pasted Text using artificial intelligence.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Description

TedCards is designed to simplify and accelerate the process of creating educational flashcards. The application enables users to transform YouTube videos into high-quality flashcards for effective learning through AI-powered content generation.

### Key Features

- **Automatic Flashcard Generation**: Generate flashcards from YouTube video captions
- **AI-Powered Content**: Front side contains a word, back side includes a detailed explanation with usage examples
- **CEFR Level Assessment**: Automatic language proficiency level assignment with user editing capability
- **Interactive Review System**: Accept, edit, or reject generated flashcards
- **Bulk Management**: Save multiple flashcards at once
- **Manual Creation**: Create custom flashcards through a form interface
- **User Authentication**: Register and log in to manage personal flashcards
- **Spaced Repetition**: Built-in algorithm for effective learning sessions
- **Multi-language Support**: Works with both Polish and English

## Tech Stack

### Frontend

- Next.js 15.3.0
- React 19
- TypeScript 5
- Tailwind CSS 4
- Shadcn/ui for accessible UI components
- Motion (formerly Framer Motion) for animations
- GSAP for advanced animations
- Zod for data validation

### Backend & Database

- Next.js API Routes
- Supabase (PostgreSQL, authentication, authorization)
- Supabase SDK for Next.js integration

### AI Integration

- Openrouter.ai as proxy to various LLM models (OpenAI, Anthropic, Google)
- Cost optimization through model selection
- API key budget management

### CI/CD & Hosting

- GitHub Actions for automation
- DigitalOcean with Docker containers

## Getting Started

### Prerequisites

- Node.js **22.14.0** (we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)
- Supabase account for database and authentication

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/eszczepan/ted-cards.git
   cd ted-cards
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check code quality
- `npm run test` - Runs unit tests
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:ui` - Runs tests with UI interface
- `npm run test:coverage` - Runs tests with coverage report
- `npm run test:e2e` - Runs end-to-end tests
- `npm run test:e2e:ui` - Runs end-to-end tests with UI
- `npm run test:e2e:report` - Shows the end-to-end test report

## Testing

This project uses Vitest for unit testing and Playwright for end-to-end testing.

### Directory Structure

```
tests/
├── e2e/            # End-to-end tests (Playwright)
│   ├── models/     # Page Object Models
│   └── *.spec.ts   # E2E test files
├── unit/           # Unit tests (Vitest)
│   ├── hooks/      # Hook tests
│   └── *.test.tsx  # Component tests
└── setup.ts        # Test environment configuration
```

### Unit Testing (Vitest)

The project uses Vitest as the testing framework for unit tests with the following best practices:

- Use `vi.fn()` for mocking functions
- Use `vi.spyOn()` to monitor existing functions
- Use `vi.mock()` for module mocking
- Create setup files for test configuration
- Write readable tests using the Arrange-Act-Assert pattern

### End-to-End Testing (Playwright)

Playwright is used for E2E testing with the following guidelines:

- Implement Page Object Model for maintainable tests
- Use data-testid attributes for resilient element selection
- Use `expect(page).toHaveScreenshot()` for visual comparisons
- Avoid flaky tests by ensuring proper wait conditions
- Use isolated browser contexts for tests
- Use shared authentication state for tests requiring login

#### Setting Up E2E Tests

1. Create a `.env.local` file with the following variables (or add to existing file):

```
# E2E Testing - fill with a valid Supabase test user
E2E_USERNAME=your_test_email@example.com
E2E_PASSWORD=your_test_password
E2E_USERNAME_ID=your_test_user_id_from_supabase
```

2. Run E2E tests with:

```bash
npm run test:e2e          # Run tests in headless mode
npm run test:e2e:ui       # Run tests with UI
```

3. View test reports with:

```bash
npm run test:e2e:report
```

#### Authentication in E2E Tests

The project uses a shared authentication approach for tests:

1. A special setup project (`setup.ts`) logs in once before all tests run
2. The authentication state is saved to `tests/e2e/.auth/user.json`
3. All tests that need authentication reuse this state, making tests faster and more reliable
4. There's no need to log in manually in each test that requires authentication

The project offers two testing modes:

- **chromium** - uses shared authentication state for tests that need a logged-in user
- **chromium-no-auth** - runs without authentication for tests that need a fresh, non-authenticated state

Run tests with specific modes:

```bash
# Run all tests with authentication
npx playwright test --project=chromium

# Run all tests without authentication
npx playwright test --project=chromium-no-auth

# Run auth setup only
npx playwright test setup.ts
```

To reset authentication state manually:

```bash
rm -rf tests/e2e/.auth
```

### Testing Best Practices

1. Test behavior, not implementation
2. Write tests that are easy to maintain
3. Avoid dependencies between tests
4. Use unit tests for logic testing and E2E tests for user flows
5. Ensure tests are deterministic (always returning the same result)

## Project Scope

### Current Capabilities

- Automatic flashcard generation from YouTube videos
- Manual flashcard creation and management
- Basic user authentication and account management
- Integration with spaced repetition algorithm

### Limitations

- No advanced spaced repetition algorithms (like SuperMemo or Anki)
- No progress tracking, statistics, or daily streaks
- No import of multiple formats (PDF, DOCX, etc.)
- No sharing of flashcard sets between users
- No thematic learning personalization
- Web application only, no native mobile apps
- No device synchronization

## Project Status

The project is currently in MVP stage and under active development.

## License

[MIT License](LICENSE)

## E2E Testing

This project uses Playwright for end-to-end testing. To run the tests:

```bash
npm run test:e2e
```

### Environment Variables for Testing

Create a `.env.local` file with the following variables for E2E tests:

```
# E2E Testing credentials
E2E_USERNAME=test@test.com
E2E_PASSWORD=your_test_password

# Optional: Base URL for tests (defaults to http://localhost:3000)
BASE_URL=http://localhost:3000
```

### Authentication in Tests

Tests that require authentication should be tagged with `@auth`:

```typescript
test.describe("Dashboard tests @auth", () => {
  // Tests here will run with authentication
});
```

Tests without the `@auth` tag will run without authentication.
