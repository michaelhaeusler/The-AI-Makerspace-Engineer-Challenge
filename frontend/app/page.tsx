'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Zap, Flower, Star, Palette } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userMessage, setUserMessage] = useState('')
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant with a groovy 70s personality. Keep responses fun, positive, and occasionally use 70s slang like "far out", "groovy", "right on", etc.')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4.1-mini')
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const [theme, setTheme] = useState<'70s' | '80s'>('70s')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse])

  useEffect(() => {
    document.body.className = `theme-${theme}`
  }, [theme])

  // Update developer message based on theme
  useEffect(() => {
    if (theme === '70s') {
      setDeveloperMessage('You are a helpful AI assistant with a groovy 70s personality. Keep responses fun, positive, and occasionally use 70s slang like "far out", "groovy", "right on", etc.')
    } else {
      setDeveloperMessage('You are a helpful AI assistant with a totally radical 80s personality. Keep responses fun, positive, and occasionally use 80s slang like "awesome", "radical", "totally", "dude", etc.')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === '70s' ? '80s' : '70s')
  }

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
          developer_message: developerMessage,
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
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={toggleTheme}
            className="retro-button px-4 py-2 mr-4"
            title={`Switch to ${theme === '70s' ? '80s' : '70s'} theme`}
          >
            <Palette className="w-5 h-5" />
            {theme === '70s' ? '80s' : '70s'}
          </button>
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

            <div className="space-y-4">
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
                  Developer Message
                </label>
                <textarea
                  value={developerMessage}
                  onChange={(e) => setDeveloperMessage(e.target.value)}
                  placeholder="Set the AI's personality..."
                  className="retro-input w-full p-3 text-retro-brown h-32 resize-none"
                />
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
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                                          <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? theme === '70s' 
                              ? 'bg-gradient-to-r from-retro-70s-brown to-retro-70s-rust text-white'
                              : 'bg-gradient-to-r from-retro-80s-blue to-retro-80s-purple text-white'
                            : theme === '70s'
                              ? 'bg-gradient-to-r from-retro-70s-olive to-retro-70s-green text-white'
                              : 'bg-gradient-to-r from-retro-80s-cyan to-retro-80s-green text-white'
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
                    <div className={`${
                     theme === '70s' 
                       ? 'bg-gradient-to-r from-retro-70s-olive to-retro-70s-green'
                       : 'bg-gradient-to-r from-retro-80s-cyan to-retro-80s-green'
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
                  placeholder="Type your groovy message..."
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
