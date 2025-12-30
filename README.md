# 🏋️ Workout Tracker

A comprehensive personal workout tracking and progression application with gamification, analytics, and real-time updates.

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## ✨ Features

### Core Features
- **🎯 Workout Logging**: Track exercises, sets, reps, weight, and RPE in real-time
- **📊 Dashboard**: View weekly summaries, streaks, personal records, and analytics
- **📅 History**: Review and analyze past workouts with detailed breakdowns
- **💪 Exercise Library**: 60+ pre-loaded exercises, searchable by muscle group
- **📈 Progress Tracking**: Automatic volume calculations and progression analytics
- **⚖️ Body Weight Tracking**: Log and visualize weight changes over time

### Gamification
- **🎮 Points System**: Earn points for completing workouts and hitting PRs
- **🔥 Streak Tracking**: Build and maintain workout streaks
- **🏆 Personal Records**: Automatic PR detection for max weight, volume, and reps
- **📊 Weekly Stats**: Track week-over-week improvements

### Advanced Features
- **🔄 Real-time Updates**: Live sync across devices using Supabase Realtime
- **🎨 Workout Programs**: Create and follow custom workout programs
- **😴 Readiness Tracking**: Log daily readiness based on sleep, energy, and recovery
- **📱 Mobile-First**: Fully responsive design optimized for gym use
- **🔐 Secure**: Row Level Security ensures data privacy

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL 15+)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Edge Functions**: Deno runtime
- **Type Safety**: Auto-generated TypeScript types

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase CLI (`npm install -g supabase`)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd workout-app
npm install
```

### 2. Setup Backend

Run the automated setup script:

```bash
npm run backend:setup
```

Or manually:

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Generate types
supabase gen types typescript --local > lib/supabase/types.ts
```

### 3. Configure Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

Get these values from `supabase status` output.

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
workout-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Main app pages
│   │   ├── page.tsx              # Dashboard
│   │   ├── log/                  # Workout logging
│   │   ├── history/              # Workout history
│   │   ├── measurements/         # Body weight tracking
│   │   └── profile/              # User profile
│   └── layout.tsx
├── components/                   # React components
│   ├── layout/                   # Layout components
│   ├── workout/                  # Workout-specific components
│   ├── stats/                    # Statistics components
│   └── ui/                       # Reusable UI components
├── lib/                          # Core utilities
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   ├── types.ts              # Generated types
│   │   ├── queries.ts            # Database queries
│   │   └── subscriptions.ts     # Real-time subscriptions
│   ├── stores/                   # Zustand stores
│   └── utils/                    # Utility functions
├── supabase/                     # Backend infrastructure
│   ├── migrations/               # Database migrations
│   │   ├── 20240101000001_initial_schema.sql
│   │   ├── 20240101000002_rls_policies.sql
│   │   └── 20240101000003_seed_data.sql
│   ├── functions/                # Edge Functions
│   │   ├── reset-weekly-stats/
│   │   └── calculate-weekly-comparison/
│   ├── config.toml               # Supabase configuration
│   └── README.md                 # Backend documentation
├── docs/                         # Documentation
│   ├── BACKEND_DEVELOPMENT_PROMPT.md
│   ├── API_REFERENCE.md
│   ├── TESTING_GUIDE.md
│   └── WORKOUT_TRACKER_SPEC.md
├── scripts/                      # Automation scripts
│   ├── setup-backend.sh
│   └── deploy-production.sh
└── BACKEND_SETUP.md             # Setup guide
```

---

## 📚 Documentation

- **[Backend Setup Guide](./BACKEND_SETUP.md)** - Complete setup instructions
- **[Supabase Backend README](./supabase/README.md)** - Backend architecture and details
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - Testing procedures
- **[Full Specification](./docs/WORKOUT_TRACKER_SPEC.md)** - Complete feature spec

---

## 🎮 Usage

### Creating a Workout

1. Navigate to **Log Workout**
2. Select or create exercises
3. Log sets with weight, reps, and RPE
4. Complete the workout to earn points

### Tracking Progress

1. View **Dashboard** for weekly stats and streaks
2. Check **History** for past workout details
3. See **Personal Records** automatically tracked
4. Monitor **Body Weight** trends in Measurements

### Using Programs

1. Create a custom workout program in **Profile**
2. Define program days (e.g., Push, Pull, Legs)
3. Start workouts from your active program
4. Track adherence and progress

---

## 🔧 Available Scripts

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Supabase
npm run supabase:start         # Start local Supabase
npm run supabase:stop          # Stop local Supabase
npm run supabase:status        # Check Supabase status
npm run supabase:reset         # Reset database
npm run supabase:push          # Push migrations
npm run supabase:types         # Generate types (local)
npm run supabase:types:prod    # Generate types (production)

# Backend
npm run backend:setup          # Automated setup
npm run backend:deploy         # Deploy to production
```

---

## 🚀 Deployment

### Deploy to Production

1. **Create Supabase Project**
   - Visit [supabase.com](https://supabase.com)
   - Create a new project

2. **Deploy Backend**
   ```bash
   npm run backend:deploy
   ```
   Follow the prompts to link and deploy.

3. **Deploy Frontend**
   - Deploy to Vercel, Netlify, or your preferred host
   - Set production environment variables
   - Connect to your Supabase project

4. **Schedule Weekly Stats Reset**
   - In Supabase Dashboard, run the cron job setup
   - See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for details

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

See [Testing Guide](./docs/TESTING_GUIDE.md) for comprehensive testing procedures.

---

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- User data completely isolated
- Service role key kept server-side only
- HTTPS enforced in production
- Input validation on all mutations

---

## 📊 Database Schema

### Core Tables
- `users` - User profiles
- `workouts` - Workout sessions
- `exercises` - Exercises in workouts
- `exercise_sets` - Individual sets
- `workout_programs` - User programs
- `program_days` - Days in programs

### Analytics Tables
- `personal_records` - Auto-tracked PRs
- `gamification_data` - Points and streaks
- `body_weight_logs` - Weight tracking
- `readiness_logs` - Daily readiness

### Reference Tables
- `exercise_library` - 60+ exercises

See [Backend README](./supabase/README.md) for complete schema details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is for personal use and portfolio demonstration.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📧 Contact

For questions or feedback, please open an issue.

---

**Built with ❤️ for fitness enthusiasts** 💪
