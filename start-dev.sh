#!/bin/bash

# Start both frontend and backend servers for development
echo "🚀 Starting RAG Chat Development Environment..."

# Check if we're in the right directory
if [ ! -f "api/app.py" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Required files not found. Please run this script from the project root."
    exit 1
fi

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ Error: uv is not installed. Please install uv first:"
    echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Clear any conflicting virtual environment variables
unset VIRTUAL_ENV

# Install project dependencies (including aimakerspace package)
echo "📦 Installing project dependencies with uv..."
uv sync
echo "📦 Installing aimakerspace package in editable mode..."
uv pip install -e .

# Install frontend dependencies
echo "📦 Installing frontend dependencies with npm..."
cd frontend && npm install && cd ..

# Start backend server in background
echo "🎵 Starting FastAPI backend server on http://localhost:8000..."
uv run --python-preference only-managed python api/app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server in background
echo "🎨 Starting Next.js frontend server on http://localhost:3000..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Save PIDs to file for stop script
echo "$BACKEND_PID" > .dev-pids
echo "$FRONTEND_PID" >> .dev-pids

echo ""
echo "✅ Development servers started successfully!"
echo "🌐 Frontend:    http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs:    http://localhost:8000/docs"
echo ""
echo "📝 To stop both servers, run: ./stop-dev.sh"
echo "📝 Or press Ctrl+C to stop this script (servers will continue running)"
echo ""

# Wait for user to stop
trap 'echo "🛑 Stopping development servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .dev-pids; exit 0' INT

# Keep script running
wait
