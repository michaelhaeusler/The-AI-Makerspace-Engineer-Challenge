# 🎵 Retro Chat Vibes - AI-Powered Chat with 70s/80s Flair! 🚀

## 🌟 What's This App All About?

Welcome to **Retro Chat Vibes** - a modern AI chat application with a nostalgic twist! 🕹️✨

This isn't just any chat app - it's a **time-traveling conversation machine** that lets you switch between the psychedelic 70s and the neon-lit 80s with a single click! Chat with AI while enjoying different retro aesthetics that'll make you feel like you're coding in a different decade.

### 🎨 What Makes This App Special?

- **🎭 Dual Theme Magic**: Switch between groovy 70s vibes and radical 80s synthwave aesthetics
- **🤖 AI-Powered Conversations**: Powered by OpenAI's latest models for intelligent responses
- **🎚️ Personality Intensity Slider**: Control how much retro personality the AI shows
- **📝 Markdown Support**: Beautifully formatted responses with code highlighting
- **🎵 Retro UI Elements**: Authentic period-appropriate design elements and animations
- **🌐 Full-Stack Architecture**: Modern tech stack with a retro twist

## 🛠️ Tech Stack - The Good Stuff

### Frontend (The Pretty Part) 🎨
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript for fewer bugs
- **Tailwind CSS** - Utility-first styling with custom retro themes
- **React Markdown** - Beautiful markdown rendering
- **Lucide React** - Crisp, customizable icons

### Backend (The Brain) 🧠
- **FastAPI** - Lightning-fast Python web framework
- **uv** - Ultra-fast Python package manager
- **OpenAI API** - Access to GPT-4.1-mini and other models
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server for production-ready performance

### Deployment (The Launch Pad) 🚀
- **Vercel** - Zero-config deployment platform
- **Monorepo Structure** - Frontend and backend in one repo

## 🚀 Quick Start - Get Started in Minutes!

### Prerequisites
- **Node.js** (v18 or higher) - For the frontend
- **Python** (v3.11 or higher) - For the backend
- **uv** - Ultra-fast Python package manager ([install here](https://astral.sh/uv/install.sh))
- **OpenAI API Key** - Your ticket to AI conversations
- **Git** - For version control

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/The-AI-Makerspace-Engineer-Challenge.git
cd The-AI-Makerspace-Engineer-Challenge
```

### 2. Start Development Servers (Easy Mode!) 🚀

We've created convenient scripts to manage your development environment:

```bash
# Start both frontend and backend servers
./start-dev.sh

# Check server status
./status-dev.sh

# Stop all servers
./stop-dev.sh
```

**That's it!** Your app will be running on:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

### 3. Manual Setup (If You Prefer) 🛠️

#### Backend Setup
```bash
# Install dependencies with uv (much faster than pip!)
uv pip install -r requirements.txt

# Start the backend server
cd api && uv run python app.py
```

#### Frontend Setup
```bash
# Install dependencies
cd frontend && npm install

# Start the development server
npm run dev
```

### 4. Get Your API Key Ready 🔑
1. Head over to [OpenAI's Platform](https://platform.openai.com/api-keys)
2. Create a new API key (or use an existing one)
3. Copy your API key - you'll need it for chatting!

## 🎮 How to Use - Let's Get Chatting!

1. **Open the App**: Navigate to `http://localhost:3000` in your browser
2. **Enter Your API Key**: Paste your OpenAI API key in the secure input field
3. **Choose Your Theme**: Switch between 70s and 80s themes using the retro toggle
4. **Adjust Personality**: Use the personality intensity slider to control how much retro flair the AI shows
5. **Start Chatting**: Type your message and watch the AI respond with themed personality!
6. **Enjoy the Experience**: Watch as your messages get beautifully formatted with markdown

## 🎨 Theme Features - The Visual Experience

### 70s Theme 🌸
- **Psychedelic Backgrounds**: Swirling patterns and warm earth tones
- **Groovy Typography**: Funky fonts with a "peace and love" aesthetic
- **Retro Animations**: Smooth transitions and period-appropriate effects
- **Authentic UI Elements**: Transistor radio-style switches and controls
- **Personality Levels**: Chill → Mellow → Groovy → Far Out

### 80s Theme 🌈
- **Neon Synthwave**: Electric blues, pinks, and purples
- **Futuristic Typography**: Bold, geometric fonts with neon glow effects
- **Retro-Futuristic Animations**: Pulsing neon effects and synthwave vibes
- **Synth-Style Controls**: Rectangular switches that look like vintage synthesizers
- **Personality Levels**: Normal → Cool → Radical → Tubular

## 🚀 Deployment - Share Your Creation!

### Deploy to Vercel (Recommended) 🌐
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy your app
vercel --prod
```

### Manual Deployment Steps
1. **Push to GitHub**: Make sure your code is in a GitHub repository
2. **Connect to Vercel**: Link your GitHub repo to Vercel
3. **Configure Environment**: Set up your environment variables
4. **Deploy**: Vercel will automatically build and deploy your app!

## 🔧 Configuration - Make It Your Own!

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Customizing Themes
The themes are defined in `frontend/app/globals.css`. Feel free to tweak the colors and animations to match your vibe!

## 🐛 Troubleshooting - Common Issues and Solutions

### Development Server Issues

**"Servers Not Starting"** 🖥️
- Run `./status-dev.sh` to check what's running
- Use `./stop-dev.sh` to clean up any stuck processes
- Make sure ports 3000 and 8000 are available
- Check that uv and npm are installed

**"Backend Not Starting"** 🧠
- Ensure uv is installed: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Try manual setup: `uv pip install -r requirements.txt`
- Check if port 8000 is available: `lsof -i :8000`

**"Frontend Not Loading"** 🎨
- Make sure Node.js is installed and up to date
- Clear the Next.js cache: `rm -rf frontend/.next`
- Check if port 3000 is available: `lsof -i :3000`

### App Issues

**"API Key Not Working"** 🔑
- Double-check your OpenAI API key
- Make sure you have credits in your OpenAI account
- Verify the API key format (starts with `sk-`)

**"Theme Not Switching"** 🎭
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for JavaScript errors
- Ensure all CSS files are loading properly

**"Personality Slider Not Working"** 🎚️
- Check that the backend is running on port 8000
- Verify the API connection in browser dev tools
- Try refreshing the page

## 🤝 Contributing - Join the Development!

We love contributions! Here's how you can help make this app even more awesome:

1. **Fork the Repository**: Create your own copy
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Your Changes**: Add some cool features
4. **Test Everything**: Make sure it works in both themes
5. **Submit a Pull Request**: Share your additions!

### Ideas for Contributions
- 🎵 Add more retro themes (60s, 90s, Y2K)
- 🎨 Create new retro animations and effects
- 🔧 Add more AI model options
- 📱 Improve mobile responsiveness
- 🎮 Add retro sound effects
- 🎚️ Enhance the personality intensity system
- 🚀 Improve the development scripts

## 📄 License - The Legal Stuff

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AI Makerspace** - For the amazing challenge and community
- **OpenAI** - For the incredible AI models
- **Vercel** - For seamless deployment
- **uv** - For ultra-fast Python package management
- **The Retro Computing Community** - For inspiration and nostalgia

## 🎉 Connect With Us!

- **GitHub**: [AI Makerspace](https://github.com/AI-Maker-Space)
- **Community**: Join our Discord for more coding adventures!
- **Share Your Creation**: Tag us on social media with your deployed apps!

---

**Made with ❤️ and lots of retro vibes by the AI Makerspace community!**

*"In a world of modern apps, be the retro one that stands out!"* 🌟 