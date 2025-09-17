#!/bin/bash

# Start backend server for development (frontend removed)
echo "🚀 Starting RAG Chat Development Environment..."

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

# Install backend dependencies
echo "📦 Installing backend dependencies with uv..."
cd api && uv pip install -r requirements.txt && cd ..

# Start backend server in background
echo "🎵 Starting FastAPI backend server on http://localhost:8000..."
(cd api && uv run python app.py) &
BACKEND_PID=$!

# Save PID to file for stop script
echo "$BACKEND_PID" > .dev-pids

echo ""
echo "✅ Backend server started successfully!"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs:   http://localhost:8000/docs"
echo ""
echo "📝 To stop the server, run: ./stop-dev.sh"
echo "📝 Or press Ctrl+C to stop this script (server will continue running)"
echo ""
echo "ℹ️  Frontend has been removed - ready for new implementation!"
echo ""

# Wait for user to stop
trap 'echo "🛑 Stopping backend server..."; kill $BACKEND_PID 2>/dev/null; rm -f .dev-pids; exit 0' INT

# Keep script running
wait
