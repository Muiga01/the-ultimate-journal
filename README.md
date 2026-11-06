# The Ultimate Journal

NovaPay Shared Trading Journal & Analytics — a production-ready trading journal built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Dashboard** — P&L summary, win ratio, profit factor, expectancy, drawdown, equity curve
- **Trade Log** — Add/edit/delete trades with entry, exit, SL/TP, confluences, lessons
- **Capital Ledger** — Accounts + deposits/withdrawals tracking
- **Analytics** — Strategy breakdown, weekday distribution, cumulative trajectory, monthly heatmap calendar
- **Settings** — Manage strategy/pair/signal dropdown lists
- **Auth** — Firebase Auth (Google + anonymous), per-user data isolation
- **Cloud Sync** — Firestore real-time sync, offline-first with conflict-safe writes

## Tech Stack

- [Next.js 14](https://muiga01.github.io) (App Router)
- [TypeScript](https://muiga01.github.io) (strict)
- [Tailwind CSS](https://muiga01.github.io)
- [Firebase](https://muiga01.github.io) (Auth + Firestore)
- [recharts](https://muiga01.github.io) (charts)
- [lucide-react](https://muiga01.github.io) (icons)
- [zod](https://muiga01.github.io) (validation)

## Getting Started

### 1. Clone the repo

```bash
git clone https://muiga01.github.io
cd the-ultimate-journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Copy `.env.example` to `.env.local` and fill in your Firebase project config:

```bash
cp .env.example .env.local
```

Create a Firebase project at [console.firebase.google.com](https://muiga01.github.io), enable Authentication (Google provider) and Firestore, then paste the config keys.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

Push to GitHub, then import the repo in [Vercel](https://muiga01.github.io). Add the same environment variables in Vercel project settings.

## Firestore Security Rules

Deploy these rules to protect user data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Roadmap to Production

- [ ] Zod validation on all write paths
- [ ] Firestore security rules
- [ ] Email/password auth option
- [ ] Trade import/export (CSV)
- [ ] Multi-user workspaces (shared journals for friends)
- [ ] Trade notifications / alerts
- [ ] Mobile app (React Native)

## License

MIT
