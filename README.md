# 🎄 The Next Holiday Classic

A modern Next.js web application for the "Next Holiday Classic" song competition. Users can browse songs, vote for their favorites, and submit their own entries for this festive music competition.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3-3FCF8E?style=flat&logo=supabase)

## ✨ Features

- **Song Voting** — Browse and vote for songs across different competition rounds
- **Song Submissions** — Submit your own original songs for consideration
- **Live Radio** — Listen to the competition station
- **Admin Dashboard** — Manage submissions, view results, and track competition progress
- **Privacy & Rules** — Full contest rules and privacy policy pages
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL + Row Level Security) |
| Language | TypeScript |
| Styling | CSS Modules + Tailwind |

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager
- Supabase account (free tier works)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd client
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy and execute the SQL schema from [`supabase-schema.sql`](supabase-schema.sql)
4. Go to Project Settings → API to find your credentials

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
client/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Homepage with song voting
│   ├── admin/                # Admin dashboard
│   ├── submit/               # Song submission form
│   ├── radio/                # Live radio streaming
│   ├── privacy/              # Privacy policy page
│   └── rules/                # Contest rules page
├── components/
│   ├── Navbar.tsx            # Navigation component
│   └── Footer.tsx            # Footer component
├── lib/
│   └── supabase-browser.ts   # Supabase client initialization
├── public/                   # Static assets
├── supabase-schema.sql       # Database schema & RLS policies
├── package.json
└── tsconfig.json
```

## 🗄 Database Schema

| Table | Description |
|-------|-------------|
| `songs` | Competition entries with metadata (title, artist, audio URL, round) |
| `voters` | Registered voters with authentication data |
| `votes` | Vote records per round (prevents duplicate voting) |
| `judges` | Competition judges with admin privileges |
| `submissions` | Song submission entries awaiting review |

## 🔐 Admin Access

For development/testing purposes:

- **Email:** info@thenextholidayclassic.com
- **Password:** holidayadmin

> ⚠️ **Important:** Change these credentials in production!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Private — All rights reserved

---

Made with ❤️ for the Holiday Classic competition