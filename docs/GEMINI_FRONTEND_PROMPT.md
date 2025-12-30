# Frontend Development Prompt for Workout Progression Tracker

## Project Overview
You are building a **personal workout tracking and progression application** with a mobile-first design. This app helps users log workouts, track progression analytics, monitor body weight, and stay motivated through gamification features like streaks and personal records.

## Your Mission
Create a **high-quality, modern, production-ready frontend** using Next.js 14 (App Router) with TypeScript and Tailwind CSS. The application should be intuitive, fast, responsive, and optimized for mobile use in the gym.

---

## Technical Stack Requirements

### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + Zustand for global state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns library
- **Icons**: Lucide React or Heroicons
- **Animations**: Framer Motion (subtle, purposeful animations)

### Backend Integration
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth (email/password)
- **Real-time**: Supabase Realtime subscriptions
- You will need to integrate with Supabase client libraries for all data operations

---

## Design System & Aesthetics

### Color Palette
Implement a modern, energetic aesthetic with this color scheme:

```css
/* Primary Background */
--bg-primary: #000000 (pure black)
--bg-secondary: #1a1a1a (dark charcoal)
--bg-card: #2a2a2a (card background)

/* Accent Colors */
--accent-pink: #ff006e (vibrant pink - primary actions, highlights)
--accent-blue: #0096ff (bright blue - secondary actions, info)
--accent-pink-hover: #d1005c (darker pink for hovers)
--accent-blue-hover: #007acc (darker blue for hovers)

/* Text Colors */
--text-primary: #ffffff (pure white)
--text-secondary: #b3b3b3 (light gray)
--text-muted: #666666 (muted gray)

/* Status Colors */
--success: #00f5d4 (cyan - progress indicators, PRs)
--warning: #ffb703 (amber - warnings, deload suggestions)
--error: #ff006e (pink - errors, use the accent pink)

/* Gradients */
--gradient-primary: linear-gradient(135deg, #ff006e 0%, #0096ff 100%)
--gradient-card: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)
```

### Typography
- **Display/Numbers**: Use a monospace font like `JetBrains Mono` or `IBM Plex Mono` for data alignment
- **Headings**: Bold, geometric sans-serif like `Space Grotesk` or `Outfit`
- **Body Text**: Clean, readable sans-serif like `DM Sans` or `Inter`

### Design Principles
1. **Mobile-First**: Design for mobile screens first, enhance for larger screens
2. **Data as Hero**: Make numbers and statistics visually prominent with large type
3. **High Contrast**: Ensure excellent readability with strong contrast
4. **Brutalist Touches**: Bold typography, asymmetric layouts, generous spacing
5. **Smooth Micro-interactions**: Subtle animations for state changes, hover effects, data updates
6. **Progressive Enhancement**: Core functionality works without JS, enhanced with interactivity

---

## Application Structure

### File Structure
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx (main app layout with navigation)
│   ├── page.tsx (dashboard/stats home)
│   ├── log/
│   │   └── page.tsx (workout logging)
│   ├── history/
│   │   └── page.tsx (workout history)
│   └── profile/
│       └── page.tsx (settings & profile)
├── api/ (Next.js API routes if needed)
└── layout.tsx (root layout)

components/
├── ui/ (reusable UI components)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Tabs.tsx
│   └── ...
├── workout/
│   ├── ExerciseList.tsx
│   ├── SetLogger.tsx
│   ├── VolumeDisplay.tsx
│   └── RestTimer.tsx
├── stats/
│   ├── WeeklyComparison.tsx
│   ├── StreakCounter.tsx
│   ├── ProgressChart.tsx
│   └── PersonalRecords.tsx
└── layout/
    ├── Navigation.tsx
    ├── BottomTabBar.tsx
    └── FloatingActionButton.tsx

lib/
├── supabase/
│   ├── client.ts
│   ├── queries.ts
│   └── types.ts
├── hooks/
│   ├── useWorkouts.ts
│   ├── useExercises.ts
│   └── useGamification.ts
├── utils/
│   ├── calculations.ts (volume, streaks, trends)
│   ├── formatting.ts (dates, numbers)
│   └── validators.ts
└── stores/
    └── workoutStore.ts (Zustand global state)
```

---

## Key Features & Screens

### 1. Dashboard/Stats (Landing Page)
**Purpose**: Overview of progress and quick actions

**Components**:
- **Streak Counter**: Large, prominent display of current workout streak
- **Weekly Summary Card**:
  - Workouts completed (X/target)
  - Total volume lifted with trend arrow (↑/↓/→)
  - Cardio minutes logged
  - Weight trend indicator
- **Quick Start Buttons**: Fast access to start workouts by program day (Push/Pull/Legs/Conditioning)
- **Recent PRs Carousel**: Horizontal scrolling cards showing latest personal records
- **Achievement Badges**: Display earned badges/milestones
- **Body Weight Graph**: Mini chart showing last 4 weeks

**Design Notes**:
- Hero section with streak in large pink gradient text
- Cards with subtle gradients and blue borders
- Prominent CTAs in pink for "Start Workout"

---

### 2. Workout Logging Screen
**Purpose**: Primary interface for logging exercises in real-time

**Components**:
- **Program Day Selector**: Chip-style buttons to choose workout type
- **Exercise List**: 
  - Draggable to reorder exercises
  - Each exercise card shows:
    - Exercise name
    - Target sets/reps
    - Previous best indicator (small badge)
    - Set logging interface (weight input, reps input, checkmark)
    - Live volume calculation
- **Add Exercise Button**: Search/autocomplete for exercises
- **Set Logging Interface**:
  - Weight input (number pad optimized)
  - Reps input (number pad optimized)
  - Complete set button (tap to mark done, shows checkmark)
  - Rest timer between sets (countdown display)
- **Bottom Sticky Bar**:
  - Total volume for session (live updating)
  - "Complete Workout" button (large, pink)

**Design Notes**:
- Minimize typing with number pad inputs
- Large tap targets for mobile
- Visual feedback for completed sets (pink checkmark)
- Auto-advance focus from weight → reps → next set
- Haptic-style animations on button presses

---

### 3. History Screen
**Purpose**: View past workouts and progress over time

**Two View Modes**:

**List View**:
- Chronological cards (most recent first)
- Each card shows:
  - Date and day of week
  - Program day type (badge)
  - Exercise count
  - Total volume badge
  - Duration
  - Tap to expand → full workout details
- Swipe gestures:
  - Swipe left: delete option
  - Swipe right: duplicate workout
- Filter options: date range, program day, completion status
- Search bar: find by exercise name

**Calendar View**:
- Monthly grid calendar
- Colored dots indicating workout days:
  - Pink dot: strength day
  - Blue dot: cardio day
  - Both: mixed workout
- Streak visualization (connecting lines between consecutive days)
- Tap day → view workout details modal

**Design Notes**:
- Toggle between views with animated tab switcher
- Smooth transitions between list/calendar
- Empty state with motivational copy

---

### 4. Exercise Detail Modal
**Purpose**: Deep dive into single exercise performance

**Components**:
- Exercise name (heading)
- Date performed
- Sets table:
  - Set number
  - Weight
  - Reps
  - Volume per set
  - Total volume (summary row)
- Historical line chart (last 8 weeks):
  - X-axis: dates
  - Y-axis: volume or max weight
  - Pink line for current exercise
- Notes section (editable)
- Action buttons: Edit, Delete

**Design Notes**:
- Full-screen modal with close button
- Chart with gradient fill under line
- Highlight PRs on chart with star icons

---

### 5. Profile & Settings
**Purpose**: User preferences and program management

**Sections**:
- **User Info**: Email, profile picture (future)
- **Current Program**: Display active program with edit option
- **Unit Preferences**:
  - Weight: lbs/kg toggle
  - Distance: mi/km toggle
- **Rest Timer Default**: Set default rest time between sets
- **Deload Tracking**: 
  - Weeks since last deload
  - Button to schedule/log deload week
- **Gamification Stats**:
  - Total points
  - Total workouts
  - Longest streak
- **Export Data**: Download CSV button
- **Sign Out**: Logout button

**Design Notes**:
- Clean, organized sections with dividers
- Toggle switches styled in pink/blue
- Logout in muted red at bottom

---

### 6. Body Weight Tracking
**Purpose**: Log and visualize weight trends

**Components**:
- **Quick Entry Form**:
  - Weight input (large number pad)
  - Date picker (defaults to today)
  - Optional notes field
  - Save button
- **Weight Graph**:
  - Line chart (last 12 weeks)
  - Blue line with dots for each entry
  - Rolling 7-day average (dashed line)
  - Y-axis: weight, X-axis: dates
- **Week-over-Week Comparison**:
  - Current week average
  - Previous week average
  - Change percentage with trend arrow
- **Historical Log List**: Scrollable list of past entries with edit/delete

**Design Notes**:
- Prominent entry form at top
- Graph with gradient background
- Trend indicators in green (loss) or amber (gain) based on goals

---

## Data Model Integration

### Key Database Tables (Supabase)
You'll be working with these main tables:

1. **users**: User profiles and settings
2. **workout_programs**: Pre-defined workout splits (Push/Pull/Legs)
3. **program_days**: Individual training days within programs
4. **workouts**: Workout sessions (date, start/end time, completion status)
5. **exercises**: Exercises within workouts (strength or cardio)
6. **exercise_sets**: Individual sets (weight, reps, completion)
7. **body_weight_logs**: Weight tracking entries
8. **personal_records**: Automatically detected PRs
9. **gamification_data**: Points, streaks, achievements

### Sample Data Flow
```typescript
// Example: Fetching workout history
const { data: workouts } = useQuery({
  queryKey: ['workouts', userId],
  queryFn: async () => {
    const { data } = await supabase
      .from('workouts')
      .select(`
        *,
        exercises (
          *,
          exercise_sets (*)
        )
      `)
      .eq('user_id', userId)
      .order('workout_date', { ascending: false })
    return data
  }
})
```

---

## Core Calculations to Implement

### 1. Volume Calculation
```typescript
// Total volume for an exercise = sum of (weight × reps) for all completed sets
function calculateExerciseVolume(sets: ExerciseSet[]): number {
  return sets
    .filter(set => set.is_completed && !set.is_warmup)
    .reduce((total, set) => total + (set.weight * set.reps), 0)
}
```

### 2. Week-over-Week Comparison
```typescript
// Compare current week to previous week volume
function compareWeeks(currentWeek: Workout[], previousWeek: Workout[]): WeekComparison {
  const currentVolume = calculateTotalVolume(currentWeek)
  const previousVolume = calculateTotalVolume(previousWeek)
  const delta = ((currentVolume - previousVolume) / previousVolume) * 100
  
  return {
    currentVolume,
    previousVolume,
    percentageChange: delta,
    changeType: delta > 5 ? 'increase' : delta < -5 ? 'decrease' : 'maintained'
  }
}
```

### 3. Streak Calculation
```typescript
// Calculate current workout streak (consecutive days)
function calculateStreak(workouts: Workout[]): number {
  const sortedDates = workouts
    .map(w => w.workout_date)
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 0
  let currentDate = new Date()
  
  for (const workoutDate of sortedDates) {
    const daysDiff = differenceInDays(currentDate, workoutDate)
    
    // Allow 1-2 rest days without breaking streak
    if (daysDiff <= 2) {
      streak++
      currentDate = workoutDate
    } else {
      break
    }
  }
  
  return streak
}
```

### 4. Personal Record Detection
```typescript
// Detect if current exercise performance is a new PR
function checkForPR(
  exerciseName: string, 
  currentVolume: number, 
  historicalData: Exercise[]
): boolean {
  const maxVolume = Math.max(...historicalData.map(e => e.totalVolume))
  return currentVolume > maxVolume
}
```

---

## Mobile Navigation Structure

### Bottom Tab Bar (Sticky Navigation)
Design a fixed bottom navigation bar with these tabs:

1. **Stats/Dashboard** 
   - Icon: TrendingUp or ChartBar
   - Label: "Stats"
   - Route: `/`

2. **Log Workout** (Primary CTA)
   - Icon: Plus or Dumbbell
   - Label: "Log"
   - Route: `/log`
   - **Special styling**: Larger icon, pink gradient background, elevated

3. **History**
   - Icon: Calendar or ClockRewind
   - Label: "History"
   - Route: `/history`

4. **Profile**
   - Icon: User or Settings
   - Label: "Profile"
   - Route: `/profile`

**Design Notes**:
- Bottom bar: black background with blur effect
- Active tab: pink accent color
- Inactive tabs: muted gray
- Center "Log" button: elevated with pink gradient, slightly larger

### Floating Action Button (Alternative/Additional)
- Large circular button (bottom-right corner)
- Pink gradient background
- Plus icon
- Opens workout logging flow
- Visible on all screens except logging screen

---

## Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Bottom tab navigation
- Full-width cards
- Larger touch targets (min 44x44px)
- Simplified charts (fewer data points)

### Tablet (768px - 1024px)
- Two-column grid for cards
- Side navigation option (left sidebar)
- Expanded charts with more detail
- Larger modals (not full-screen)

### Desktop (> 1024px)
- Three-column grid for dashboard cards
- Persistent side navigation
- Full-featured charts with hover tooltips
- Multi-panel views (e.g., history list + detail side-by-side)

---

## State Management Strategy

### Global State (Zustand)
Store these in global state:
- Current user session
- Active workout (in-progress)
- User preferences (units, theme)
- Gamification stats (streak, points)

### Server State (React Query)
Fetch and cache these with React Query:
- Workout history
- Exercise data
- Body weight logs
- Personal records
- Weekly analytics

### Local Component State
Use React hooks for:
- Form inputs (controlled components)
- Modal open/close
- Dropdown selections
- Loading indicators

---

## Animation Guidelines

### Micro-interactions (Framer Motion)
- **Button clicks**: Scale down slightly (0.95) on press
- **Card reveals**: Fade in + slide up on mount
- **Number updates**: Animate count-up for volume/stats
- **Streak counter**: Pulse animation on increment
- **PR badge**: Confetti or sparkle effect on achievement
- **Swipe gestures**: Smooth spring animation for delete/duplicate

### Page Transitions
- Fade between route changes (subtle, quick)
- Slide transitions for modals (bottom-up on mobile)
- No heavy animations during data loading

---

## Accessibility Requirements

1. **Semantic HTML**: Use proper heading hierarchy, landmark elements
2. **ARIA Labels**: Add labels for icon-only buttons, screen readers
3. **Keyboard Navigation**: All interactive elements accessible via keyboard
4. **Focus Indicators**: Visible focus rings (pink outline)
5. **Color Contrast**: Ensure WCAG AA compliance (minimum 4.5:1 for body text)
6. **Touch Targets**: Minimum 44x44px for mobile buttons
7. **Alt Text**: Provide descriptions for all images/icons
8. **Error Messages**: Clear, actionable feedback for form errors

---

## Performance Optimization

1. **Code Splitting**: Dynamic imports for charts, modals
2. **Image Optimization**: Use Next.js Image component
3. **Virtual Scrolling**: For long workout history lists
4. **Debounced Inputs**: For search/autocomplete
5. **Optimistic Updates**: Update UI immediately, sync with DB
6. **Request Deduplication**: React Query handles this automatically
7. **Lazy Load Routes**: Use Next.js App Router's built-in code splitting
8. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations

---

## Authentication Flow

### Login/Signup Pages
- Email + password fields
- Clear error messages (below each field)
- Loading state on submit
- "Sign up" / "Already have account?" toggle
- Password visibility toggle icon
- Gradient background with app preview imagery

### Protected Routes
- Middleware to check authentication status
- Redirect to `/login` if not authenticated
- Persist session with Supabase Auth

---

## Testing Recommendations

### Unit Tests (Vitest)
- Calculation functions (volume, streaks, averages)
- Date utilities (week comparisons, formatting)
- Validation logic

### Component Tests (React Testing Library)
- Button interactions
- Form submissions
- Modal open/close
- State updates

### E2E Tests (Playwright)
- Complete workout logging flow
- View history and details
- Week-over-week comparison
- Authentication flow

---

## Development Phases

### Phase 1: MVP (Prioritize)
1. Authentication (login/signup)
2. Dashboard with weekly summary
3. Workout logging (strength exercises only)
4. Volume calculations (real-time)
5. Basic history list view
6. Body weight logging

### Phase 2: Enhanced Features
1. Calendar view for history
2. Personal records tracking with badges
3. Gamification (streaks, points, achievements)
4. Charts and graphs (Recharts integration)
5. Cardio exercise logging
6. Exercise search/autocomplete

### Phase 3: Advanced (Optional)
1. Readiness score logging
2. Deload week recommendations
3. Coach intelligence (automated suggestions)
4. Advanced analytics dashboard
5. Export data functionality
6. Offline support (service worker)

---

## UI Component Examples

### Primary Button
```tsx
<button className="
  bg-gradient-to-r from-pink-500 to-pink-600 
  hover:from-pink-600 hover:to-pink-700
  text-white font-semibold 
  px-6 py-3 rounded-lg
  transition-all duration-200
  active:scale-95
  shadow-lg shadow-pink-500/30
">
  Start Workout
</button>
```

### Stat Card
```tsx
<div className="
  bg-gradient-to-br from-gray-900 to-gray-800
  border border-blue-500/30
  rounded-2xl p-6
  shadow-xl
">
  <h3 className="text-gray-400 text-sm uppercase tracking-wide">
    Total Volume
  </h3>
  <p className="text-5xl font-mono font-bold text-white mt-2">
    24,500
    <span className="text-pink-500 ml-2">lbs</span>
  </p>
  <div className="flex items-center mt-3 text-cyan-400">
    <TrendingUp className="w-4 h-4 mr-1" />
    <span className="text-sm">+12% from last week</span>
  </div>
</div>
```

### Streak Counter (Hero Element)
```tsx
<div className="text-center py-12">
  <div className="inline-block">
    <p className="text-gray-400 uppercase text-sm tracking-wide mb-2">
      Current Streak
    </p>
    <h1 className="
      text-8xl font-bold font-mono
      bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500
      bg-clip-text text-transparent
      animate-pulse
    ">
      14
    </h1>
    <p className="text-gray-400 mt-2">days</p>
  </div>
</div>
```

---

## Error Handling

1. **Network Errors**: Display toast notifications with retry option
2. **Validation Errors**: Inline error messages below form fields
3. **Auth Errors**: Clear messaging on login/signup screens
4. **Empty States**: Friendly illustrations with CTAs (e.g., "Log your first workout!")
5. **Loading States**: Skeleton screens for data-heavy components
6. **Fallbacks**: Graceful degradation if features fail

---

## Additional Notes

- **Mobile Safari Considerations**: Account for safe area insets (notch)
- **PWA Ready**: Add manifest.json for installability
- **Dark Mode Only**: No light theme needed (black/pink/blue aesthetic)
- **Fast Tap Response**: Use `touchstart` events for instant feedback
- **Haptic Feedback**: Use vibration API on supported devices (subtle)
- **Number Pad Optimization**: Ensure inputs trigger numeric keyboards on mobile

---

## Deliverables

Please build:

1. **Complete Next.js 14 app** with all routes and pages
2. **Reusable component library** (buttons, cards, inputs, modals)
3. **Supabase integration layer** (client setup, query functions, types)
4. **Calculation utilities** (volume, streaks, trends, PRs)
5. **Responsive layouts** for mobile, tablet, desktop
6. **Tailwind config** with custom color scheme
7. **TypeScript types** for all data models
8. **Basic error handling** and loading states
9. **README.md** with setup instructions

---

## Success Criteria

A successful frontend implementation will:

✅ Be fully responsive and mobile-optimized  
✅ Use the pink/black/white/blue color scheme consistently  
✅ Integrate seamlessly with Supabase backend  
✅ Calculate volume, streaks, and trends accurately  
✅ Provide smooth, intuitive user experience  
✅ Follow TypeScript best practices  
✅ Be performant (fast page loads, smooth animations)  
✅ Be accessible (WCAG AA compliance)  
✅ Have clean, maintainable code architecture  

---

## Questions to Consider

As you build, think about:
- How can I minimize taps/inputs for gym users?
- Are the most important actions immediately visible?
- Do the numbers stand out and communicate progress clearly?
- Is the color scheme used purposefully (not randomly)?
- Are loading states handled gracefully?
- Does the app feel fast and responsive?

---

## Final Reminder

This is a **personal passion project** for someone serious about fitness tracking. Make it **beautiful, functional, and motivating**. The UI should inspire users to log workouts consistently and celebrate their progress.

Good luck, and build something amazing! 💪🏋️

