# RingkasCepat - Setup Guide

## Overview

RingkasCepat is an AI-powered content summarization application that helps you combat information overload by providing instant summaries of articles, YouTube videos, and text content.

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed (for PostgreSQL database)
- Google Gemini API key ([Get one here](https://ai.google.dev/))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here  # Generate a random string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google Gemini API
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

**Important:** Replace `your_secret_key_here` with a secure random string and add your actual Google Gemini API key.

### 3. Start the Database

Start the PostgreSQL database using Docker:

```bash
npm run db:dev
```

This will start a PostgreSQL container on port 5433.

### 4. Generate and Push Database Schema

Generate the database schema and push it to PostgreSQL:

```bash
npm run db:generate
npm run db:push
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Usage

### First Time Setup

1. Navigate to http://localhost:3000
2. Click "Create Account" to sign up
3. Enter your email and password
4. Sign in with your credentials

### Using the App

1. After signing in, you'll be redirected to `/app`
2. Choose your content type:
   - **URL**: Paste an article URL to summarize
   - **Text**: Paste any text content
   - **YouTube**: Paste a YouTube video URL (requires captions/transcripts)

3. Select your preferred summary style:
   - **Key Bullet Points**: Get 3-5 main takeaways
   - **100-Word Summary**: Get a concise paragraph
   - **Explain Like I'm 5 (ELI5)**: Get a simple explanation

4. Click "Ringkas" to generate the summary

5. Use the action buttons to:
   - **Copy**: Copy summary to clipboard
   - **Share**: Share using native share dialog (mobile)
   - **History**: View your past summaries

## Features

- ✨ AI-powered summarization using Google Gemini 2.0 Flash
- 📄 Summarize articles from any URL
- 🎥 Extract and summarize YouTube video transcripts
- 📝 Process raw text content
- 🎨 Multiple summary styles (bullet points, paragraph, ELI5)
- 📜 Summary history with search
- 🌓 Dark mode support
- 🔐 Secure authentication with Better Auth
- 💾 PostgreSQL database with Drizzle ORM

## Database Management

### View Database (Drizzle Studio)

```bash
npm run db:studio
```

This opens a web interface at http://localhost:4983 to view and manage your database.

### Reset Database

```bash
npm run db:reset
```

**Warning:** This will delete all data and recreate the schema.

### Stop Database

```bash
npm run db:dev-down
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Make sure Docker is running
2. Check if the PostgreSQL container is running: `docker ps`
3. Restart the database: `npm run db:dev-down && npm run db:dev`

### API Key Issues

If you get Gemini API errors:

1. Verify your `GOOGLE_API_KEY` is correctly set in `.env`
2. Check your API key is valid at https://ai.google.dev/
3. Ensure you have API quota available

### Authentication Issues

If login/signup doesn't work:

1. Verify `BETTER_AUTH_SECRET` is set in `.env`
2. Clear browser cookies and try again
3. Check the database tables were created correctly

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **AI**: Google Gemini API
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Icons**: Lucide React
- **Theming**: next-themes

## Project Structure

```
├── app/
│   ├── actions/         # Server Actions
│   ├── api/             # API routes (Better Auth)
│   ├── app/             # Main app page (protected)
│   ├── sign-in/         # Sign in page
│   └── sign-up/         # Sign up page
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── history-sheet.tsx
│   └── summary-result.tsx
├── db/
│   ├── schema/          # Database schemas
│   └── index.ts         # Database client
├── lib/
│   ├── auth.ts          # Better Auth config
│   ├── gemini.ts        # Gemini AI client
│   └── content-fetcher.ts # Content fetching utilities
└── middleware.ts        # Route protection
```

## Next Steps

1. Customize the UI to match your brand
2. Add more summary styles
3. Implement summary export (PDF, Markdown)
4. Add social authentication (Google, GitHub)
5. Deploy to production (Vercel, Railway, etc.)

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Google AI Documentation](https://ai.google.dev/docs)

---

Built with ❤️ using modern web technologies
