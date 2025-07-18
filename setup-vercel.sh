#!/bin/bash

# AutoVal Vercel Deployment Setup Script
# This script helps you set up the initial Vercel configuration

set -e

echo "🚀 AutoVal Vercel Deployment Setup"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel@latest
    echo "✅ Vercel CLI installed successfully"
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "📋 Step 1: Login to Vercel"
echo "Please login to your Vercel account:"
vercel login

echo ""
echo "📋 Step 2: Link Project to Vercel"
echo "This will create a .vercel directory with your project configuration:"
vercel link

echo ""
echo "📋 Step 3: Get Project Information"
echo "Copy these values to your GitHub repository secrets:"
echo ""

# Get org ID
echo "🏢 VERCEL_ORG_ID:"
if [ -f .vercel/project.json ]; then
    cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4
else
    echo "❌ Could not find .vercel/project.json. Please run 'vercel link' first."
fi

echo ""

# Get project ID
echo "📦 VERCEL_PROJECT_ID:"
if [ -f .vercel/project.json ]; then
    cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4
else
    echo "❌ Could not find .vercel/project.json. Please run 'vercel link' first."
fi

echo ""
echo "🔑 To get your VERCEL_TOKEN:"
echo "1. Go to https://vercel.com/account/tokens"
echo "2. Create a new token"
echo "3. Copy the token value"

echo ""
echo "📖 Next Steps:"
echo "1. Add the above values as secrets in your GitHub repository:"
echo "   - Go to Settings → Secrets and variables → Actions"
echo "   - Add VERCEL_ORG_ID, VERCEL_PROJECT_ID, and VERCEL_TOKEN"
echo ""
echo "2. Configure environment variables in Vercel dashboard:"
echo "   - Go to your project settings"
echo "   - Add NODE_ENV=production"
echo "   - Add NEXT_TELEMETRY_DISABLED=1"
echo ""
echo "3. Update the backend URL in vercel.json if needed"
echo ""
echo "4. Create a pull request to test preview deployment"
echo ""
echo "5. Merge to main branch for production deployment"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "✅ Setup script completed! Your project is ready for Vercel deployment."
