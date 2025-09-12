'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Zap, Flower, Star } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [theme, setTheme] = useState<'70s' | '80s'>('70s')
  const [messages, setMessages] = useState<Message[]>([])
  const [userMessage, setUserMessage] = useState('')
  const [personalityIntensity, setPersonalityIntensity] = useState<number>(2) // 0=off, 1=light, 2=medium, 3=full
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4.1-mini')
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Generate developer message based on theme and personality intensity
  const getDeveloperMessage = () => {
    if (personalityIntensity === 0) {
      return 'You are a helpful AI assistant. Provide clear, professional, and informative responses.'
    }

    if (theme === '70s') {
      switch (personalityIntensity) {
        case 1:
          return 'You are a helpful AI assistant with a subtle 70s vibe. Occasionally use gentle 70s expressions like "cool" or "nice" but keep responses mostly professional.'
        case 2:
          return 'You are a helpful AI assistant with a groovy 70s personality. Keep responses fun and positive, occasionally using 70s slang like "far out", "groovy", "right on", etc.'
        case 3:
          return 'You are a totally groovy AI assistant with a full-on 70s personality! Use lots of 70s slang like "far out", "groovy", "right on", "peace and love", "dig it", "outta sight", "keep on truckin\'", and "can you dig it?". Be super positive, hippie-like, and use phrases like "that\'s totally groovy, man!" and "peace out!"'
        default:
          return 'You are a helpful AI assistant with a groovy 70s personality. Keep responses fun, positive, and occasionally use 70s slang like "far out", "groovy", "right on", etc.'
      }
    } else {
      switch (personalityIntensity) {
        case 1:
          return 'You are a helpful AI assistant with a subtle 80s vibe. Occasionally use gentle 80s expressions like "cool" or "awesome" but keep responses mostly professional.'
        case 2:
          return 'You are a helpful AI assistant with a totally radical 80s personality. Keep responses fun, positive, and occasionally use 80s slang like "awesome", "radical", "totally", "dude", etc.'
        case 3:
          return 'You are a totally radical AI assistant with a full-on 80s personality! Use lots of 80s slang like "awesome", "radical", "totally", "dude", "gnarly", "bodacious", "tubular", "like totally", "for sure", and "no way!". Be super enthusiastic, use phrases like "that\'s totally awesome, dude!" and "radical!"'
        default:
          return 'You are a helpful AI assistant with a totally radical 80s personality. Keep responses fun, positive, and occasionally use 80s slang like "awesome", "radical", "totally", "dude", etc.'
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse])

  useEffect(() => {
    // Preserve existing body classes and only toggle theme classes
    document.body.classList.remove('theme-70s', 'theme-80s')
    document.body.classList.add(`theme-${theme}`)
  }, [theme])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim() || !apiKey.trim()) return

    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setUserMessage('')
    setIsLoading(true)
    setCurrentResponse('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: getDeveloperMessage(),
          user_message: userMessage,
          model: model,
          api_key: apiKey
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let fullResponse = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        fullResponse += chunk
        setCurrentResponse(fullResponse)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setCurrentResponse('')
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, something went wrong! Please check your API key and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-6">
          {/* Theme Toggle Switch */}
          <div className={`theme-switch ${theme === '70s' ? 'theme-70s' : 'theme-80s'}`}>
            <button
              onClick={() => setTheme('70s')}
              className={`switch-option ${theme === '70s' ? 'active' : ''}`}
              title="Switch to 70s theme"
            >
              <span className="switch-label">70s</span>
              {theme === '70s' && <div className="switch-indicator"></div>}
            </button>
            <button
              onClick={() => setTheme('80s')}
              className={`switch-option ${theme === '80s' ? 'active' : ''}`}
              title="Switch to 80s theme"
            >
              <span className="switch-label">80s</span>
              {theme === '80s' && <div className="switch-indicator"></div>}
            </button>
          </div>
        </div>
        <div className="groovy-text text-4xl md:text-6xl mb-4">
          <Flower className="inline-block mr-4 animate-groove" />
          {theme === '70s' ? 'GROOVY CHAT' : 'SYNTHWAVE CHAT'}
          <Star className="inline-block ml-4 animate-groove" />
        </div>
        <p className="font-retro text-lg md:text-xl">
          {theme === '70s'
            ? '✨ Far out AI conversations with a 70s vibe! ✨'
            : '🎵 Totally radical AI conversations with an 80s vibe! 🎵'
          }
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="retro-card p-6 h-fit">
            <h2 className="groovy-text text-2xl text-retro-brown mb-4">
              <Zap className="inline-block mr-2 text-retro-orange" />
              SETTINGS
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-retro-brown font-bold mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="retro-input w-full p-3 text-retro-brown"
                />
              </div>

              <div>
                <label className="block text-retro-brown font-bold mb-2">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="retro-input w-full p-3 text-retro-brown"
                >
                  <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-retro-brown font-bold mb-2">
                  {theme === '70s' ? '🌻 Groovy Vibes' : '🌈 Radical Energy'}
                </label>
                <div className="personality-slider-container">
                  <div className="slider-labels">
                    <span className="slider-label-text">
                      {theme === '70s' ? 'Chill' : 'Normal'}
                    </span>
                    <span className="slider-label-text">
                      {theme === '70s' ? 'Mellow' : 'Cool'}
                    </span>
                    <span className="slider-label-text">
                      {theme === '70s' ? 'Groovy' : 'Radical'}
                    </span>
                    <span className="slider-label-text">
                      {theme === '70s' ? 'Far Out' : 'Tubular'}
                    </span>
                  </div>
                  <div className="slider-wrapper">
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={personalityIntensity}
                      onChange={(e) => setPersonalityIntensity(parseInt(e.target.value))}
                      className="personality-range-slider"
                    />
                  </div>
                  <div className="slider-description">
                    {personalityIntensity === 0 && (
                      <span className="text-sm text-retro-brown">
                        {theme === '70s' ? '🤙 Professional and chill responses' : '💼 Professional and normal responses'}
                      </span>
                    )}
                    {personalityIntensity === 1 && (
                      <span className="text-sm text-retro-brown">
                        {theme === '70s' ? '🌿 Subtle 70s vibes with gentle slang' : '✨ Subtle 80s vibes with cool expressions'}
                      </span>
                    )}
                    {personalityIntensity === 2 && (
                      <span className="text-sm text-retro-brown">
                        {theme === '70s' ? '🌸 Groovy personality with classic 70s slang' : '🎵 Radical personality with classic 80s slang'}
                      </span>
                    )}
                    {personalityIntensity === 3 && (
                      <span className="text-sm text-retro-brown">
                        {theme === '70s' ? '🌈 Full hippie mode - peace, love, and far out vibes!' : '🚀 Full synthwave mode - totally tubular and bodacious!'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="retro-card p-6 h-[600px] flex flex-col">
              <h2 className="groovy-text text-2xl text-retro-brown mb-4">
                💬 CHAT ZONE
              </h2>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 chat-messages-container">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'user'
                        ? theme === '70s'
                          ? 'bg-gradient-to-r from-retro-70s-brown to-retro-70s-rust text-white'
                          : 'bg-gradient-to-r from-retro-80s-blue to-retro-80s-purple text-white'
                        : theme === '70s'
                          ? 'bg-gradient-to-r from-retro-70s-olive to-retro-70s-green text-white'
                          : 'bg-gradient-to-r from-retro-80s-purple to-retro-80s-magenta text-white'
                        }`}
                    >
                      {message.role === 'user' ? (
                        <p className="font-retro">{message.content}</p>
                      ) : (
                        <div className="font-retro prose prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                              code: ({ node, inline, ...props }: any) =>
                                inline ? (
                                  <code className="bg-black bg-opacity-30 px-1 py-0.5 rounded text-sm" {...props} />
                                ) : (
                                  <code className="block bg-black bg-opacity-30 p-2 rounded text-sm mb-2 overflow-x-auto" {...props} />
                                ),
                              pre: ({ node, ...props }) => <pre className="bg-black bg-opacity-30 p-2 rounded text-sm mb-2 overflow-x-auto" {...props} />,
                              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-white border-opacity-50 pl-4 italic mb-2" {...props} />,
                              a: ({ node, ...props }) => <a className="text-blue-200 underline" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                              em: ({ node, ...props }) => <em className="italic" {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`${theme === '70s'
                      ? 'bg-gradient-to-r from-retro-70s-olive to-retro-70s-green'
                      : 'bg-gradient-to-r from-retro-80s-purple to-retro-80s-magenta'
                      } text-white p-4 rounded-2xl`}>
                      <div className="flex items-center space-x-2">
                        <div className="typing-indicator"></div>
                        <span className="font-retro">AI is thinking...</span>
                      </div>
                      {currentResponse && (
                        <div className="font-retro prose prose-invert max-w-none mt-2">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                              code: ({ node, inline, ...props }: any) =>
                                inline ? (
                                  <code className="bg-black bg-opacity-30 px-1 py-0.5 rounded text-sm" {...props} />
                                ) : (
                                  <code className="block bg-black bg-opacity-30 p-2 rounded text-sm mb-2 overflow-x-auto" {...props} />
                                ),
                              pre: ({ node, ...props }) => <pre className="bg-black bg-opacity-30 p-2 rounded text-sm mb-2 overflow-x-auto" {...props} />,
                              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-white border-opacity-50 pl-4 italic mb-2" {...props} />,
                              a: ({ node, ...props }) => <a className="text-blue-200 underline" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                              em: ({ node, ...props }) => <em className="italic" {...props} />,
                            }}
                          >
                            {currentResponse}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={theme === '70s' ? "Type your groovy message..." : "Type your radical message..."}
                  className="retro-input flex-1 p-3 text-retro-brown"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !userMessage.trim() || !apiKey.trim()}
                  className="retro-button px-6 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-retro-brown font-retro">
            🎵 Keep on groovin' with AI! 🎵
          </p>
        </div>
      </div>
    </div>
  )
}
