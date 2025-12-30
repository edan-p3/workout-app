#!/bin/bash

# Workout Tracker - Production Deployment Script
# This script deploys the backend to Supabase production

set -e

echo "🏋️  Workout Tracker - Production Deployment"
echo "==========================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Please install: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase!"
    echo ""
    echo "Please run: supabase login"
    exit 1
fi

echo "✅ Authenticated with Supabase"
echo ""

# Get project ref
read -p "Enter your Supabase project ref: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project ref is required"
    exit 1
fi

# Link project
echo ""
echo "🔗 Linking to project..."
supabase link --project-ref "$PROJECT_REF"

echo ""
echo "✅ Project linked!"
echo ""

# Confirm deployment
read -p "⚠️  This will deploy to PRODUCTION. Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

# Push database migrations
echo ""
echo "📦 Deploying database migrations..."
supabase db push

echo ""
echo "✅ Database deployed!"
echo ""

# Deploy edge functions
echo "⚡ Deploying edge functions..."
echo ""

echo "Deploying reset-weekly-stats..."
supabase functions deploy reset-weekly-stats

echo ""
echo "Deploying calculate-weekly-comparison..."
supabase functions deploy calculate-weekly-comparison

echo ""
echo "✅ Edge functions deployed!"
echo ""

# Set secrets
echo "🔐 Setting up secrets..."
read -p "Enter your Supabase URL: " SUPABASE_URL
read -p "Enter your Service Role Key: " SERVICE_ROLE_KEY

supabase secrets set SUPABASE_URL="$SUPABASE_URL"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY"

echo ""
echo "✅ Secrets configured!"
echo ""

# Generate production types
echo "🔧 Generating production types..."
supabase gen types typescript --linked > lib/supabase/types.ts

echo ""
echo "✅ Types generated!"
echo ""

echo "==========================================="
echo "✨ Deployment Complete! 🎉"
echo "==========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Update your .env.local with production values:"
echo "   NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>"
echo "   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>"
echo ""
echo "2. Schedule the weekly stats reset in Supabase Dashboard:"
echo "   SQL Editor > Run the cron job setup from BACKEND_SETUP.md"
echo ""
echo "3. Test your production deployment"
echo ""
echo "4. Deploy your Next.js app to Vercel/Netlify"
echo ""
echo "==========================================="
echo "🚀 Your backend is live! 💪"
echo "==========================================="

