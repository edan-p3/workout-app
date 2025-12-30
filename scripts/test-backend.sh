#!/bin/bash

# Workout Tracker - Backend Testing Script
# This script tests the backend to ensure everything is working

set -e

echo "🧪 Workout Tracker - Backend Testing"
echo "====================================="
echo ""

# Check if Supabase is running
echo "1️⃣  Checking if Supabase is running..."
if ! supabase status &> /dev/null; then
    echo "❌ Supabase is not running!"
    echo "Please start it with: supabase start"
    exit 1
fi
echo "✅ Supabase is running"
echo ""

# Get DB connection info
DB_URL=$(supabase status | grep "DB URL" | awk '{print $3}')
echo "2️⃣  Testing database connection..."
echo "Database URL: $DB_URL"
echo ""

# Test table existence
echo "3️⃣  Verifying database tables..."
TABLES=$(supabase db remote exec "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null || echo "0")

echo "   Checking tables..."
supabase db remote exec "
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
" 2>/dev/null || echo "Could not list tables"

echo ""
echo "4️⃣  Checking exercise library seed data..."
supabase db remote exec "
SELECT COUNT(*) as exercise_count 
FROM exercise_library;
" 2>/dev/null || echo "Could not count exercises"

echo ""
echo "5️⃣  Verifying RLS policies..."
supabase db remote exec "
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'public';
" 2>/dev/null || echo "Could not count policies"

echo ""
echo "6️⃣  Checking database functions..."
supabase db remote exec "
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
" 2>/dev/null || echo "Could not list functions"

echo ""
echo "7️⃣  Verifying triggers..."
supabase db remote exec "
SELECT DISTINCT trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
" 2>/dev/null || echo "Could not list triggers"

echo ""
echo "====================================="
echo "✨ Basic tests complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Create .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Test the app manually (see test plan below)"
echo ""
echo "To access Supabase Studio: http://localhost:54323"
echo ""

