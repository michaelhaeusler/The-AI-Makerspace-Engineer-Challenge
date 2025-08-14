# 🎵 Groovy Chat - AI Engineer Challenge Frontend

A far-out, retro 70s-style chat interface for the AI Engineer Challenge! This groovy application features psychedelic colors, funky animations, and a totally rad user experience.

## ✨ Features

- 🎨 **Retro 70s Design**: Authentic vintage styling with earth tones and groovy patterns
- 💬 **Real-time Chat**: Stream responses from OpenAI's GPT models
- 🔧 **Customizable Settings**: Configure AI personality and model selection
- 🌈 **Psychedelic Animations**: Smooth, groovy transitions and effects
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔒 **Secure API Key Input**: Password-style input for your OpenAI API key

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

### Running the Backend

Make sure your FastAPI backend is running on port 8000:

```bash
cd api
pip install -r requirements.txt
python app.py
```

The frontend will automatically proxy API requests to `http://localhost:8000`.

## 🎯 How to Use

1. **Enter your OpenAI API key** in the settings panel
2. **Choose your preferred model** (GPT-4.1 Mini, GPT-4o, or GPT-3.5 Turbo)
3. **Customize the AI personality** by editing the developer message
4. **Start chatting!** Type your message and press the groovy send button
5. **Watch the magic happen** as the AI responds with a 70s vibe!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Retro Color Palette**: Earth tones, warm oranges, and psychedelic gradients
- **Groovy Typography**: Orbitron font for that authentic 70s computer feel
- **Animated Elements**: Floating flowers, spinning indicators, and smooth transitions
- **Vintage UI Components**: Retro borders, buttons, and input fields
- **Responsive Layout**: Adapts beautifully to any screen size

## 🔧 Configuration

The application uses:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Custom CSS** for retro animations

## 🚀 Deployment

This frontend is designed to work seamlessly with Vercel deployment. The `next.config.js` includes API rewrites to handle backend communication.

## 🎵 Keep on Groovin'!

Enjoy your far-out AI chat experience! Remember to share your groovy creation with the community! 🌟