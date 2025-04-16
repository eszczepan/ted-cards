# TedCards

A web application that automatically generates educational flashcards from YouTube videos using artificial intelligence.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
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
