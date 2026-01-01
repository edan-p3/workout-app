# Deployment Commands

## Step 1: Push to GitHub

Open Terminal and run these commands one at a time:

```bash
# Navigate to your project
cd /Users/edandvora/Documents/workout-app

# Check what's ready to push
git status

# Push to GitHub
git push origin main
```

When prompted:
- Username: Your GitHub username (e.g., edan-p3)
- Password: Use a Personal Access Token (NOT your GitHub password)

If you don't have a token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it "Workout App"
4. Check the "repo" box
5. Click "Generate token"
6. Copy the token and use it as your password

---

## Step 2: Set Up Supabase Database

### A. Create Tables

1. Open this file in your code editor:
   `/Users/edandvora/Documents/workout-app/supabase/migrations/20240101000001_initial_schema.sql`

2. Select ALL the text (Cmd+A) and Copy (Cmd+C)

3. Go to: https://app.supabase.com/project/pglywgkyidvabxoeknoh/sql/new

4. Paste ALL the SQL code

5. Click "RUN" (or press Cmd+Enter)

6. Wait for "Success" message

### B. Add Security Policies

1. Open this file:
   `/Users/edandvora/Documents/workout-app/supabase/migrations/20240101000002_rls_policies.sql`

2. Select ALL and Copy

3. Go to: https://app.supabase.com/project/pglywgkyidvabxoeknoh/sql/new
   (Open a NEW query - don't reuse the old one)

4. Paste and click RUN

### C. Verify Tables Were Created

Go to: https://app.supabase.com/project/pglywgkyidvabxoeknoh/editor

Look in the left sidebar. You should see these tables:
- users
- workouts
- exercises
- exercise_sets
- gamification_data
- workout_programs
- program_days
- body_weight_logs
- personal_records
- readiness_logs
- exercise_library

If you see these tables = SUCCESS! ✅

---

## Step 3: Enable Email Authentication

1. Go to: https://app.supabase.com/project/pglywgkyidvabxoeknoh/auth/providers

2. Find "Email" in the list

3. Make sure the toggle is ON (green/blue)

4. If it was OFF, turn it ON and click Save

---

## Step 4: Configure Vercel

### A. Add Environment Variables

1. Go to: https://vercel.com/dashboard

2. Click on your "workout-app" project

3. Click "Settings" at the top

4. Click "Environment Variables" on the left

5. Add FIRST variable:
   - Key: NEXT_PUBLIC_SUPABASE_URL
   - Value: https://pglywgkyidvabxoeknoh.supabase.co
   - Check ALL THREE boxes: Production, Preview, Development
   - Click "Save"

6. Add SECOND variable:
   - Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbHl3Z2t5aWR2YWJ4b2Vrbm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTMzMDUsImV4cCI6MjA4MjY4OTMwNX0.jgd5KzAht1YMrmeQzk8Z5kGPqbkLGMOIwuSa9FAxGlQ
   - Check ALL THREE boxes: Production, Preview, Development
   - Click "Save"

### B. Redeploy

After adding both variables:

1. Go to the "Deployments" tab

2. Find the most recent deployment at the top

3. Click the three dots "..." on the right

4. Click "Redeploy"

5. Click "Redeploy" again to confirm

6. Wait 2-3 minutes for it to build

---

## Step 5: Test Your Live Site

Once Vercel shows "Ready":

1. Click "Visit" or go to your site URL

2. Click "Sign Up"

3. Create a test account with:
   - Your name
   - Your email
   - A password

4. You should be taken to the dashboard

5. Go to "Profile" tab and verify your name shows up

6. Try starting a workout

If all this works = COMPLETE SUCCESS! 🎉

---

## Troubleshooting

If signup doesn't work:
- Check Vercel logs: Deployments → Click deployment → "Functions" tab
- Verify environment variables are set correctly in Vercel
- Make sure Supabase tables exist

If you see errors about "relation does not exist":
- The database migrations didn't run properly
- Go back to Step 2 and run them again

