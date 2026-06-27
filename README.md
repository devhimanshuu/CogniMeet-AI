# CogniMeet.AI

AI-powered meeting intelligence platform. CogniMeet brings intelligent agents into your video meetings — they listen, take notes, extract action items, search the web, and generate insights automatically.

## Features

- **Live Video Calls** — Stream Video-powered meetings with auto-transcription, recording, and closed captions
- **AI Coworkers** — Create custom agents with specific personas (Scrum Master, Product Manager, Tech Architect, etc.)
- **Post-Meeting AI Analysis** — Auto-generated summaries, action items, key decisions, topics, and productivity scores
- **Post-Meeting Chat** — Continue talking with your AI agent about the meeting with full context
- **Web Search** — Tavily-powered search during chat for real-time fact-checking
- **LLM Fallback Chain** — Groq (primary) → OpenRouter (fallback) → HuggingFace (final fallback) for zero downtime
- **Premium Tier** — Polar-powered subscriptions with free tier limits (5 meetings, 3 agents)
- **Dashboard** — Stats, recent meetings, productivity scoring, and command palette (Cmd+K)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth | Clerk |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle |
| API | tRPC |
| Video | Stream Video SDK |
| Chat | Stream Chat SDK |
| Background Jobs | Inngest |
| AI (Primary) | Groq (Llama 3.3 70B) |
| AI (Fallback 1) | OpenRouter |
| AI (Fallback 2) | HuggingFace Inference |
| Web Search | Tavily |
| Payments | Polar |
| UI Components | shadcn/ui + Radix |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- Accounts for: [Clerk](https://clerk.com), [Stream](https://getstream.io), [Groq](https://groq.com), [Polar](https://polar.sh)

### 1. Clone and install

```bash
git clone https://github.com/devhimanshuu/CogniMeet.ai.git
cd CogniMeet.ai
npm install --legacy-peer-deps
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in all values in `.env`. See [Environment Variables](#environment-variables) for details.

### 3. Set up the database

```bash
npm run db:push
```

### 4. Set up webhooks (local development)

CogniMeet uses webhooks from Stream Video and Clerk. For local development, expose your local server with [ngrok](https://ngrok.com):

```bash
npm run dev:webhook
```

Configure webhook URLs in:
- **Stream Dashboard** → `https://your-ngrok-url/api/webhook`
- **Clerk Dashboard** → `https://your-ngrok-url/api/webhook/clerk`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL (change for production) | Yes |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Stream Video API key | Yes |
| `STREAM_VIDEO_SECRET_KEY` | Stream Video secret | Yes |
| `NEXT_PUBLIC_STREAM_CHAT_API_KEY` | Stream Chat API key | Yes |
| `STREAM_CHAT_SECRET_KEY` | Stream Chat secret | Yes |
| `GROQ_API_KEY` | Groq API key (primary LLM) | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key (fallback LLM) | Yes |
| `HUGGINGFACE_API_KEY` | HuggingFace API key (final fallback) | Yes |
| `TAVILY_API_KEY` | Tavily web search API key | Yes |
| `ELEVENLABS_API_KEY` | ElevenLabs API key (reserved for voice) | No |
| `POLAR_ACCESS_TOKEN` | Polar subscription management token | Yes |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio GUI |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Sign-in / sign-up pages
│   ├── (dashboard)/        # Dashboard, agents, meetings, upgrade
│   ├── call/               # Live video call view
│   └── api/                # tRPC handler, webhooks, Inngest
├── modules/                # Feature modules
│   ├── agents/             # Agent CRUD, presets, UI
│   ├── meetings/           # Meeting CRUD, transcript, chat, UI
│   ├── premium/            # Subscription management
│   ├── dashboard/          # Dashboard stats, sidebar, navbar
│   ├── call/               # Video call provider and UI
│   └── landing/            # Landing page sections
├── components/             # Shared UI components (shadcn/ui)
├── db/                     # Drizzle schema and client
├── trpc/                   # tRPC init, client, routers
├── inngest/                # Background job definitions
├── lib/                    # SDK clients (Stream, Polar, AI, Tavily)
└── hooks/                  # Shared React hooks
```

## How It Works

1. **Create an Agent** — Choose from 6 presets or write custom instructions
2. **Schedule a Meeting** — Creates a Stream Video call with auto-transcription and recording enabled
3. **Join the Call** — The agent joins as a participant; Stream handles transcription
4. **Webhooks Process Events** — Call start/end, participant changes, transcription ready, recording ready
5. **AI Analysis (Inngest)** — When transcription is ready, Inngest fetches it, runs it through the LLM fallback chain, and extracts summary, action items, key decisions, topics, and a productivity score
6. **Post-Meeting Chat** — Chat with the agent about the meeting; it has full context and can search the web via Tavily

## Deployment

The app is ready to deploy on [Vercel](https://vercel.com):

1. Push to GitHub
2. Import in Vercel
3. Set all environment variables (update `NEXT_PUBLIC_APP_URL` to your production domain)
4. Update webhook URLs in Stream and Clerk dashboards to point to your production domain

## License

MIT
