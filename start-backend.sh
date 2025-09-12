#!/bin/bash

# Start only the backend server using uv
echo "🚀 Starting Retro Chat Vibes Backend with uv..."

# Check if we're in the right directory
if [ ! -f "api/app.py" ]; then
    echo "❌ Error: api/app.py not found. Please run this script from the project root."
    exit 1
fi

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ Error: uv is not installed. Please install uv first:"
    echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Install dependencies if needed
echo "📦 Ensuring dependencies are installed..."
uv pip install -r requirements.txt

# Use uv to run the Python app
echo "🎵 Starting FastAPI server on http://localhost:8000..."
echo "💡 To start both frontend and backend, use: ./start-dev.sh"
echo ""
cd api && uv run python app.py
