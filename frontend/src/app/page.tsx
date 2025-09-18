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
  X,
  ChevronDown,
  Cpu,
  Settings
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
  const [showReplaceDialog, setShowReplaceDialog] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedColor, setSelectedColor] = useState('emerald')

  const availableModels = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & efficient' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Classic choice' }
  ]

  const availableColors = [
    { id: 'blue', name: 'Blue', description: 'Professional' },
    { id: 'teal', name: 'Teal', description: 'Modern' },
    { id: 'purple', name: 'Purple', description: 'Creative' },
    { id: 'indigo', name: 'Indigo', description: 'Elegant' },
    { id: 'rose', name: 'Rose', description: 'Warm' },
    { id: 'orange', name: 'Orange', description: 'Energetic' },
    { id: 'amber', name: 'Amber', description: 'Inviting' },
    { id: 'cyan', name: 'Cyan', description: 'Fresh' },
    { id: 'stone', name: 'Stone', description: 'Neutral' },
    { id: 'violet', name: 'Violet', description: 'Modern' },
    { id: 'red', name: 'Red', description: 'Bold' },
    { id: 'emerald', name: 'Emerald', description: 'Natural' }
  ]

  const getColorClasses = (color: string) => ({
    userBg: `bg-${color}-600`,
    assistantBg: `bg-gray-50`,
    assistantText: `text-gray-900`,
    button: `bg-${color}-600 hover:bg-${color}-700`,
    loading: `text-${color}-600`,
    loadingText: `text-${color}-700`,
    icon: `text-${color}-500 hover:text-${color}-700`,
    iconHover: `hover:bg-gray-100`,
    selectedBg: `bg-gray-100`,
    selectedBorder: `border-${color}-300`
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const processFileUpload = (file: File) => {
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
  }

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      // If there's already a file, show replacement confirmation
      if (uploadedFile && uploadedFile.status === 'completed') {
        setPendingFile(file)
        setShowReplaceDialog(true)
      } else {
        processFileUpload(file)
      }
    } else {
      setError('Please upload a PDF file only.')
    }
  }

  const handleReplaceConfirm = () => {
    if (pendingFile) {
      processFileUpload(pendingFile)
    }
    setShowReplaceDialog(false)
    setPendingFile(null)
  }

  const handleReplaceCancel = () => {
    setShowReplaceDialog(false)
    setPendingFile(null)
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
          model: selectedModel,
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
              className={`w-full h-12 rounded-xl ${getColorClasses(selectedColor).button} text-white font-medium transition-all duration-200`}
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

          <div className="flex items-center space-x-3">
            {/* Remove Document Button (when document is loaded) */}
            {uploadedFile && uploadedFile.status === 'completed' && (
              <button
                onClick={removeFile}
                className={`p-1.5 rounded-lg ${getColorClasses(selectedColor).iconHover} transition-colors`}
                title="Remove document"
              >
                <X className={`w-4 h-4 ${getColorClasses(selectedColor).icon}`} />
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
        {/* File Upload Area - Always Visible */}
        <Card className={`mb-6 border-2 border-dashed ${uploadedFile && uploadedFile.status === 'completed'
          ? 'border-neutral-300 bg-neutral-50/50'
          : 'border-neutral-200 bg-white/50'
          } backdrop-blur-sm hover:border-neutral-400 transition-all duration-200`}>
          <div {...getRootProps()} className="p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            {uploadedFile && uploadedFile.status === 'completed' ? (
              <>
                <div className="flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-neutral-500 mr-2" />
                  <Upload className={`w-6 h-6 ${isDragActive ? 'text-neutral-600' : 'text-neutral-400'}`} />
                </div>
                <p className="text-sm font-medium text-neutral-700 mb-1">
                  {isDragActive ? 'Drop new PDF to replace' : 'Upload a different PDF'}
                </p>
                <p className="text-xs text-neutral-500">
                  Current: {uploadedFile.name} • {formatFileSize(uploadedFile.size)}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Drag and drop or click to replace document
                </p>
              </>
            ) : (
              <>
                <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? 'text-neutral-600' : 'text-neutral-400'}`} />
                <p className="text-base font-medium text-neutral-700 mb-1">
                  {isDragActive ? 'Drop your PDF here' : 'Upload a PDF document'}
                </p>
                <p className="text-sm text-neutral-500">
                  Drag and drop or click to select a PDF file
                </p>
              </>
            )}
          </div>
        </Card>

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
                    : 'Upload a PDF document above to get started, or ask general questions.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.role === 'user'
                      ? `${getColorClasses(selectedColor).userBg} text-white rounded-2xl rounded-br-md px-4 py-3`
                      : `${getColorClasses(selectedColor).assistantBg} ${getColorClasses(selectedColor).assistantText} rounded-2xl rounded-bl-md px-4 py-3`
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
                    <div className={`${getColorClasses(selectedColor).assistantBg} rounded-2xl rounded-bl-md px-4 py-3`}>
                      <div className="flex items-center space-x-2">
                        <Loader2 className={`w-4 h-4 animate-spin ${getColorClasses(selectedColor).loading}`} />
                        <span className={`text-sm ${getColorClasses(selectedColor).loadingText}`}>AI is thinking...</span>
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
              className={`px-6 py-3 h-auto rounded-xl ${getColorClasses(selectedColor).button} text-white transition-all duration-200`}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Language Model</h4>
              <div className="space-y-2">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedModel === model.id
                      ? `${getColorClasses(selectedColor).selectedBorder} ${getColorClasses(selectedColor).selectedBg}`
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Theme Color</h4>
              <div className="grid grid-cols-4 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`p-2 rounded-lg border text-center transition-colors ${selectedColor === color.id
                      ? `border-${color.id}-300 bg-gray-100`
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex justify-center space-x-1 mb-1">
                      <div className={`w-3 h-3 bg-${color.id}-600 rounded`}></div>
                      <div className="w-3 h-3 bg-gray-50 border rounded"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-700">{color.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowSettings(false)}
              className={`w-full ${getColorClasses(selectedColor).button} text-white`}
            >
              Done
            </Button>
          </Card>
        </div>
      )}

      {/* Replace File Dialog */}
      {showReplaceDialog && pendingFile && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Replace Document?</h3>
              <p className="text-sm text-neutral-600 mb-4">
                This will replace your current document with the new one.
              </p>
              <div className="space-y-2 text-xs text-neutral-500">
                <div className="flex justify-between">
                  <span>Current:</span>
                  <span className="font-medium">{uploadedFile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>New:</span>
                  <span className="font-medium">{pendingFile.name}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleReplaceCancel}
                className="flex-1 rounded-xl border-neutral-200 hover:bg-neutral-50"
              >
                Keep Current
              </Button>
              <Button
                onClick={handleReplaceConfirm}
                className={`flex-1 rounded-xl ${getColorClasses(selectedColor).button} text-white`}
              >
                Replace
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}