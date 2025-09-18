'use client'

/**
 * Main RAG Chat Application Component
 * 
 * This is the primary application component that orchestrates the entire RAG chat experience.
 * It has been refactored from a 950-line monolith into a clean, maintainable architecture
 * using custom hooks for business logic and focused components for UI concerns.
 * 
 * Architecture:
 * - Custom hooks handle complex state management and side effects
 * - UI components are focused and reusable
 * - Business logic is separated from presentation logic
 * - Type safety is enforced throughout the application
 */

import { useState } from 'react'

// Custom hooks for business logic
import { useSettings } from '@/hooks/useSettings'
import { useChat } from '@/hooks/useChat'
import { useFileUpload } from '@/hooks/useFileUpload'

// UI Components
import { ApiKeyInput } from '@/components/ApiKeyInput'
import { Header } from '@/components/Header'
import { FileUploadArea } from '@/components/FileUploadArea'
import { ChatArea } from '@/components/ChatArea'
import { ChatInput } from '@/components/ChatInput'
import { SettingsModal } from '@/components/SettingsModal'
import { ReplaceFileDialog } from '@/components/ReplaceFileDialog'
import { ErrorAlert } from '@/components/ErrorAlert'

/**
 * Main RAG Chat Component
 * 
 * Manages the overall application state and coordinates between different subsystems:
 * - Authentication (API key management)
 * - Settings (model and theme preferences)
 * - File upload and processing
 * - Chat functionality
 * - UI state management
 */
export default function RAGChat() {
  // Authentication state
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(true)

  // UI state
  const [showSettings, setShowSettings] = useState(false)

  // Settings management (model, theme with localStorage persistence)
  const { selectedModel, selectedColor, setSelectedModel, setSelectedColor } = useSettings()

  // Chat functionality (messages, streaming, keyboard shortcuts)
  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    error,
    setError,
    messagesEndRef,
    textareaRef,
    sendMessage,
    handleKeyPress
  } = useChat({ apiKey, selectedModel, uploadedFile: null })

  // File upload management (drag & drop, progress, document processing)
  const {
    uploadedFile,
    processingStep,
    showReplaceDialog,
    pendingFile,
    getRootProps,
    getInputProps,
    isDragActive,
    handleReplaceConfirm,
    handleReplaceCancel,
    handleRemoveDocument
  } = useFileUpload({
    apiKey,
    selectedModel,
    setMessages,
    setIsLoading,
    setError
  })

  // Update chat hook with current uploadedFile state
  const chatWithFile = useChat({ apiKey, selectedModel, uploadedFile })

  /**
   * Handle API key submission from the initial screen
   */
  const handleApiKeySubmit = (key: string) => {
    setApiKey(key)
    setShowApiKeyInput(false)
  }

  /**
   * Show the API key input screen if not authenticated
   */
  if (showApiKeyInput) {
    return (
      <ApiKeyInput
        selectedColor={selectedColor}
        onApiKeySubmit={handleApiKeySubmit}
      />
    )
  }

  /**
   * Main application interface
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Application Header */}
      <Header onSettingsClick={() => setShowSettings(true)} />

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">

        {/* File Upload Section */}
        <FileUploadArea
          uploadedFile={uploadedFile}
          processingStep={processingStep}
          selectedColor={selectedColor}
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          onRemoveDocument={handleRemoveDocument}
        />

        {/* Error Display */}
        <ErrorAlert error={error} />

        {/* Chat Messages Area */}
        <ChatArea
          messages={chatWithFile.messages.length > 0 ? chatWithFile.messages : messages}
          isLoading={chatWithFile.isLoading || isLoading}
          uploadedFile={uploadedFile}
          selectedColor={selectedColor}
          messagesEndRef={chatWithFile.messagesEndRef || messagesEndRef}
        />

        {/* Message Input */}
        <ChatInput
          input={chatWithFile.input || input}
          setInput={chatWithFile.setInput || setInput}
          isLoading={chatWithFile.isLoading || isLoading}
          uploadedFile={uploadedFile}
          selectedColor={selectedColor}
          textareaRef={chatWithFile.textareaRef || textareaRef}
          onSendMessage={chatWithFile.sendMessage || sendMessage}
          onKeyPress={chatWithFile.handleKeyPress || handleKeyPress}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        selectedModel={selectedModel}
        selectedColor={selectedColor}
        onModelChange={setSelectedModel}
        onColorChange={setSelectedColor}
        onClose={() => setShowSettings(false)}
      />

      {/* File Replacement Confirmation Dialog */}
      <ReplaceFileDialog
        isOpen={showReplaceDialog}
        currentFile={uploadedFile}
        pendingFile={pendingFile}
        selectedColor={selectedColor}
        onConfirm={handleReplaceConfirm}
        onCancel={handleReplaceCancel}
      />
    </div>
  )
}