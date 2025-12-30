#!/bin/bash

# Workout Tracker - Backend Setup Script
# This script sets up the Supabase backend for local development

set -e

echo "🏋️  Workout Tracker - Backend Setup"
echo "===================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo "  or"
    echo "  brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📁 Project directory confirmed"
echo ""

# Start Supabase
echo "🚀 Starting Supabase..."
supabase start

echo ""
echo "✅ Supabase started successfully!"
echo ""

# Apply migrations
echo "📦 Applying database migrations..."
supabase db push

echo ""
echo "✅ Migrations applied!"
echo ""

# Generate types
echo "🔧 Generating TypeScript types..."
supabase gen types typescript --local > lib/supabase/types.ts

echo ""
echo "✅ Types generated!"
echo ""

# Get credentials
echo "📋 Getting local credentials..."
SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')
SERVICE_ROLE_KEY=$(supabase status | grep "service_role key" | awk '{print $3}')

echo ""
echo "✅ Setup complete!"
echo ""
echo "===================================="
echo "📝 Next Steps:"
echo "===================================="
echo ""
echo "1. Create .env.local file with these values:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY"
echo "SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Visit http://localhost:3000"
echo ""
echo "4. Access Supabase Studio at http://localhost:54323"
echo ""
echo "===================================="
echo "✨ Happy coding! 💪"
echo "===================================="

