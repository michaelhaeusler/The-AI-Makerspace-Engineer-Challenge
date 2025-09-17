'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  Send,
  FileText,
  MessageCircle,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface UploadedFile {
  name: string
  size: number
  uploadProgress: number
  status: 'uploading' | 'completed' | 'error'
}

export default function RAGChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      // Remove old file if exists
      setUploadedFile({
        name: file.name,
        size: file.size,
        uploadProgress: 0,
        status: 'uploading'
      })
      setError(null)

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadedFile(prev => prev ? { ...prev, uploadProgress: progress } : null)

        if (progress >= 100) {
          clearInterval(interval)
          setUploadedFile(prev => prev ? { ...prev, status: 'completed' } : null)
        }
      }, 100)
    } else {
      setError('Please upload a PDF file only.')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  })

  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !apiKey) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: uploadedFile
            ? `You are a helpful AI assistant. Answer questions based on the uploaded PDF document: ${uploadedFile.name}. If the answer is not in the document, please say so.`
            : 'You are a helpful AI assistant.',
          user_message: input.trim(),
          model: 'gpt-4o-mini',
          api_key: apiKey
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let assistantContent = ''
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        assistantContent += chunk

        setMessages(prev =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, content: assistantContent }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-neutral-600 to-neutral-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">RAG Chat</h1>
            <p className="text-neutral-600 text-sm">Enter your OpenAI API key to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors bg-white/50"
              />
            </div>

            <Button
              onClick={() => apiKey && setShowApiKeyInput(false)}
              disabled={!apiKey}
              className="w-full h-12 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-all duration-200"
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-600 to-neutral-800 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">RAG Chat</h1>
              <p className="text-sm text-neutral-500">AI-powered document chat</p>
            </div>
          </div>

          {uploadedFile && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-3 py-1">
                <FileText className="w-3 h-3" />
                <span className="text-xs font-medium">{uploadedFile.name}</span>
                <button onClick={removeFile} className="ml-1 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
        {/* File Upload Area */}
        {!uploadedFile && (
          <Card className="mb-6 border-2 border-dashed border-neutral-200 bg-white/50 backdrop-blur-sm hover:border-neutral-300 transition-colors">
            <div {...getRootProps()} className="p-8 text-center cursor-pointer">
              <input {...getInputProps()} />
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-neutral-600' : 'text-neutral-400'}`} />
              <p className="text-lg font-medium text-neutral-700 mb-2">
                {isDragActive ? 'Drop your PDF here' : 'Upload a PDF document'}
              </p>
              <p className="text-sm text-neutral-500">
                Drag and drop or click to select a PDF file
              </p>
            </div>
          </Card>
        )}

        {/* Upload Progress */}
        {uploadedFile && uploadedFile.status === 'uploading' && (
          <Card className="mb-6 p-4 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">Uploading {uploadedFile.name}</span>
              <span className="text-sm text-neutral-500">{formatFileSize(uploadedFile.size)}</span>
            </div>
            <Progress value={uploadedFile.uploadProgress} className="h-2" />
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 mb-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <ScrollArea className="h-full p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-2">
                  {uploadedFile ? 'Ask questions about your document' : 'Start a conversation'}
                </h3>
                <p className="text-neutral-500">
                  {uploadedFile
                    ? `Your PDF "${uploadedFile.name}" is ready for questions.`
                    : 'Upload a PDF document to get started, or ask general questions.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.role === 'user'
                        ? 'bg-neutral-900 text-white rounded-2xl rounded-br-md px-4 py-3'
                        : 'bg-neutral-100 text-neutral-900 rounded-2xl rounded-bl-md px-4 py-3'
                      }`}>
                      {message.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      ) : (
                        <div className="prose prose-sm prose-neutral max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                        <span className="text-sm text-neutral-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </Card>

        {/* Input Area */}
        <Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex space-x-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={uploadedFile ? "Ask a question about your document..." : "Type your message..."}
              className="flex-1 min-h-[60px] max-h-[200px] resize-none border-neutral-200 focus:border-neutral-400 rounded-xl bg-white/50 transition-colors"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 h-auto rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}