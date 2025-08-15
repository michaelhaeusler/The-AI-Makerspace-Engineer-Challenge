# 🎵 Retro Chat Vibes - AI-Powered Chat with 70s/80s Flair! 🚀

<p align="center">
  <img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
       width="200px" height="auto" alt="AI Makerspace Logo"/>
</p>

## 🌟 What's This Groovy App All About?

Welcome to **Retro Chat Vibes** - your totally rad AI chat application that takes you back to the golden era of computing! 🕹️✨

This isn't just any chat app - it's a **time-traveling conversation machine** that lets you switch between the psychedelic 70s and the neon-lit 80s with a single click! Chat with AI while vibing to different retro aesthetics that'll make you feel like you're coding in a different decade.

### 🎨 What Makes This App So Special?

- **🎭 Dual Theme Magic**: Switch between groovy 70s vibes and radical 80s synthwave aesthetics
- **🤖 AI-Powered Conversations**: Powered by OpenAI's latest models for intelligent responses
- **📝 Markdown Support**: Beautifully formatted responses with code highlighting
- **🎵 Retro UI Elements**: Authentic period-appropriate design elements and animations
- **🌐 Full-Stack Awesomeness**: Modern tech stack with a retro twist

## 🛠️ Tech Stack - The Good Stuff

### Frontend (The Pretty Part) 🎨
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript for fewer bugs
- **Tailwind CSS** - Utility-first styling with custom retro themes
- **React Markdown** - Beautiful markdown rendering
- **Lucide React** - Crisp, customizable icons

### Backend (The Brain) 🧠
- **FastAPI** - Lightning-fast Python web framework
- **OpenAI API** - Access to GPT-4.1-mini and other models
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server for production-ready performance

### Deployment (The Launch Pad) 🚀
- **Vercel** - Zero-config deployment platform
- **Monorepo Structure** - Frontend and backend in one repo

## 🚀 Quick Start - Get Grooving in Minutes!

### Prerequisites
- **Node.js** (v18 or higher) - For the frontend magic
- **Python** (v3.8 or higher) - For the backend brains
- **OpenAI API Key** - Your ticket to AI conversations
- **Git** - For version control awesomeness

### 1. Clone This Bad Boy
```bash
git clone https://github.com/your-username/The-AI-Makerspace-Engineer-Challenge.git
cd The-AI-Makerspace-Engineer-Challenge
```

### 2. Backend Setup (The Brain Surgery) 🧠
```bash
# Navigate to the API directory
cd api

# Create a virtual environment (Python best practice!)
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install the dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

Your backend will be grooving on `http://localhost:8000`! 🎵

### 3. Frontend Setup (The Visual Magic) ✨
```bash
# Open a new terminal and navigate to the frontend
cd frontend

# Install the dependencies
npm install

# Start the development server
npm run dev
```

Your frontend will be vibing on `http://localhost:3000`! 🎨

### 4. Get Your API Key Ready 🔑
1. Head over to [OpenAI's Platform](https://platform.openai.com/api-keys)
2. Create a new API key (or use an existing one)
3. Copy that bad boy - you'll need it for chatting!

## 🎮 How to Use - Let's Get Chatting!

1. **Open the App**: Navigate to `http://localhost:3000` in your browser
2. **Enter Your API Key**: Paste your OpenAI API key in the secure input field
3. **Choose Your Vibe**: Switch between 70s and 80s themes using the retro toggle
4. **Start Chatting**: Type your message and watch the AI respond with retro flair!
5. **Enjoy the Magic**: Watch as your messages get beautifully formatted with markdown

## 🎨 Theme Features - The Visual Goodness

### 70s Theme 🌸
- **Psychedelic Backgrounds**: Swirling patterns and warm earth tones
- **Groovy Typography**: Funky fonts that scream "peace and love"
- **Retro Animations**: Smooth transitions and period-appropriate effects
- **Authentic UI Elements**: Transistor radio-style switches and controls

### 80s Theme 🌈
- **Neon Synthwave**: Electric blues, pinks, and purples
- **Futuristic Typography**: Bold, geometric fonts with neon glow effects
- **Retro-Futuristic Animations**: Pulsing neon effects and synthwave vibes
- **Synth-Style Controls**: Rectangular switches that look like vintage synthesizers

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

## 🐛 Troubleshooting - When Things Get Weird

### Common Issues and Solutions

**"API Key Not Working"** 🔑
- Double-check your OpenAI API key
- Make sure you have credits in your OpenAI account
- Verify the API key format (starts with `sk-`)

**"Backend Not Starting"** 🖥️
- Ensure Python virtual environment is activated
- Check if port 8000 is available
- Verify all dependencies are installed

**"Frontend Not Loading"** 🎨
- Make sure Node.js is installed and up to date
- Clear the `.next` cache: `rm -rf .next`
- Check if port 3000 is available

**"Theme Not Switching"** 🎭
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for JavaScript errors
- Ensure all CSS files are loading properly

## 🤝 Contributing - Join the Retro Revolution!

We love contributions! Here's how you can help make this app even more awesome:

1. **Fork the Repository**: Create your own copy
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Your Changes**: Add some retro magic
4. **Test Everything**: Make sure it works in both themes
5. **Submit a Pull Request**: Share your groovy additions!

### Ideas for Contributions
- 🎵 Add more retro themes (60s, 90s, Y2K)
- 🎨 Create new retro animations and effects
- 🔧 Add more AI model options
- 📱 Improve mobile responsiveness
- 🎮 Add retro sound effects

## 📄 License - The Legal Stuff

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments - Shoutouts!

- **AI Makerspace** - For the amazing challenge and community
- **OpenAI** - For the incredible AI models
- **Vercel** - For seamless deployment
- **The Retro Computing Community** - For inspiration and nostalgia

## 🎉 Connect With Us!

- **GitHub**: [AI Makerspace](https://github.com/AI-Maker-Space)
- **Community**: Join our Discord for more retro coding adventures!
- **Share Your Creation**: Tag us on social media with your deployed apps!

---

**Made with ❤️ and lots of retro vibes by the AI Makerspace community!**

*"In a world of modern apps, be the retro one that stands out!"* 🌟 