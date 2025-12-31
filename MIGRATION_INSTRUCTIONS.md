# Database Migration Instructions

## Run These in Supabase SQL Editor

Go to: https://app.supabase.com/project/pglywgkyidvabxoeknoh/sql/new

---

## STEP 1: Run Initial Schema

Copy the entire contents of:
`supabase/migrations/20240101000001_initial_schema.sql`

Paste into SQL Editor and click **RUN**

---

## STEP 2: Run RLS Policies

Copy the entire contents of:
`supabase/migrations/20240101000002_rls_policies.sql`

Paste into SQL Editor and click **RUN**

---

## STEP 3: (Optional) Run Seed Data

Copy the entire contents of:
`supabase/migrations/20240101000003_seed_data.sql`

Paste into SQL Editor and click **RUN**

---

## Verify

After running, check:
- https://app.supabase.com/project/pglywgkyidvabxoeknoh/editor

You should see these tables:
- users
- workout_programs
- program_days
- workouts
- exercises
- exercise_sets
- body_weight_logs
- personal_records
- gamification_data
- readiness_logs
- exercise_library

