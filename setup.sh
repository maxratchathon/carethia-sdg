#!/bin/bash
# Carethia Project Setup Script

set -e

echo "🌸 Carethia - MVP Setup"
echo "========================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "⚠️  pnpm is not installed. Installing..."
  npm install -g pnpm
fi

echo "✅ Node.js $(node --version)"
echo "✅ pnpm $(pnpm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Environment setup
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file"
  echo "⚠️  Please update .env with your database URL"
else
  echo "✅ .env file already exists"
fi
echo ""

# Database setup
echo "🗄️  Setting up database..."
echo "Make sure PostgreSQL is running!"
echo ""
echo "Run these commands manually:"
echo "  pnpm db:migrate    # Run migrations"
echo "  pnpm db:seed       # Seed sample data (optional)"
echo "  pnpm --filter @carethia/db studio  # View database"
echo ""

# Start development
echo "🚀 Development Setup Complete!"
echo ""
echo "To start development servers:"
echo "  pnpm dev"
echo ""
echo "Services will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  API: http://localhost:3001"
echo "  API Docs: http://localhost:3001/api"
echo ""
echo "Happy coding! 🎉"
