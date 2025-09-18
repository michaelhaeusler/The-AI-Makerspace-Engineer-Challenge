/**
 * Custom hook for handling file upload functionality
 * Manages upload state, progress tracking, and document processing
 */

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadedFile, Message } from '@/types'

interface UseFileUploadProps {
  apiKey: string
  selectedModel: string
}

export const useFileUpload = ({
  apiKey,
  selectedModel
}: UseFileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [processingStep, setProcessingStep] = useState<string>('')
  const [showReplaceDialog, setShowReplaceDialog] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Main file processing function - handles upload, processing, and summary generation
   */
  const processFileUpload = async (file: File) => {
    const startTime = Date.now()
    console.log(`🚀 Starting document processing for ${file.name} (${formatFileSize(file.size)})`)

    setUploadedFile({
      name: file.name,
      size: file.size,
      uploadProgress: 0,
      status: 'uploading'
    })
    setError(null)
    setIsLoading(true)
    setProcessingStep('Preparing document...')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('apiKey', apiKey)

      // Smart progress simulation with step updates
      let currentProgress = 0
      const progressInterval = setInterval(() => {
        setUploadedFile(prev => {
          if (prev && prev.uploadProgress < 85) {
            currentProgress += 3
            if (currentProgress < 30) {
              setProcessingStep('Reading document...')
            } else if (currentProgress < 70) {
              setProcessingStep('Analyzing content...')
            } else {
              setProcessingStep('Almost ready...')
            }
            return { ...prev, uploadProgress: currentProgress }
          }
          return prev
        })
      }, 800)

      console.log('📤 Uploading and processing document...')
      const uploadStart = Date.now()

      // Upload file and process (this includes embedding creation)
      const response = await fetch('/api/upload-pdf-only', {
        method: 'POST',
        body: formData,
      })

      const uploadEnd = Date.now()
      console.log(`✅ Document processing completed in ${uploadEnd - uploadStart}ms`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }

      await response.json() // Process result but don't need to use it
      clearInterval(progressInterval)

      // Complete the upload progress
      setUploadedFile({
        name: file.name,
        size: file.size,
        uploadProgress: 100,
        status: 'completed'
      })
      setProcessingStep('Creating summary...')

      console.log('🤖 Generating document summary...')
      const summaryStart = Date.now()

      // Stream the summary generation
      const summaryResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: `You are analyzing a document. Please provide a comprehensive summary in the following format:

# 📄 Document Summary

## Overview
[2-3 sentence overview of what this document is about]

## 🎯 Main Topics
- **Topic 1**: Brief description
- **Topic 2**: Brief description  
- **Topic 3**: Brief description

## 📚 Key Sections
- **Section 1**: Brief description
- **Section 2**: Brief description
- **Section 3**: Brief description

## 💡 Suggested Questions
Based on the content I analyzed, here are specific questions you can ask:
- [Generate 3-4 specific questions that can be answered using the content provided above]
- [Reference actual topics, names, concepts, or data mentioned in the document]
- [Make questions specific enough that they can be answered with the available content]
- [Example: Instead of "How does X work?" use "How does [specific process mentioned] work in [specific context]?"]

---
*Document "${file.name}" has been processed and is ready for questions!*`,
          user_message: 'Please analyze and summarize the uploaded document.',
          model: selectedModel,
          api_key: apiKey
        }),
      })

      if (!summaryResponse.ok) {
        throw new Error('Summary generation failed')
      }

      const reader = summaryResponse.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let summaryContent = ''
      let isFirstChunk = true
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        summaryContent += chunk

        // Add message and hide loading spinner as soon as first chunk arrives
        if (isFirstChunk) {
          const summaryMessage: Message = {
            role: 'assistant',
            content: summaryContent,
            timestamp: Date.now()
          }
          setMessages(prev => [...prev, summaryMessage])
          setIsLoading(false)
          isFirstChunk = false
        } else {
          // Update existing message
          setMessages(prev =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, content: summaryContent }
                : msg
            )
          )
        }
      }

      const summaryEnd = Date.now()
      console.log(`✅ Summary generated in ${summaryEnd - summaryStart}ms`)

      // Clean up processing step
      setProcessingStep('')

      const totalTime = Date.now() - startTime
      console.log(`🎉 Total processing time: ${totalTime}ms (${(totalTime / 1000).toFixed(1)}s)`)

    } catch (error) {
      console.error('❌ Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      setUploadedFile(prev => prev ? { ...prev, status: 'error' } : null)
      setIsLoading(false)
      setProcessingStep('')
    }
  }

  /**
   * Handle file drop - manages replacement dialog for existing files
   */
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

  /**
   * Confirm file replacement
   */
  const handleReplaceConfirm = () => {
    if (pendingFile) {
      processFileUpload(pendingFile)
    }
    setShowReplaceDialog(false)
    setPendingFile(null)
  }

  /**
   * Cancel file replacement
   */
  const handleReplaceCancel = () => {
    setShowReplaceDialog(false)
    setPendingFile(null)
  }

  /**
   * Remove uploaded document and return to normal chat mode
   */
  const handleRemoveDocument = async () => {
    try {
      setError(null)
      console.log('🗑️ Removing uploaded document...')

      const response = await fetch('/api/clear-document', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to clear document')
      }

      // Clear frontend state
      setUploadedFile(null)
      setMessages([])
      setProcessingStep('')

      console.log('✅ Document removed - returned to normal chat mode')

    } catch (error) {
      console.error('❌ Error removing document:', error)
      setError(error instanceof Error ? error.message : 'Failed to remove document')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false
  })

  // Helper function for file size formatting
  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return {
    uploadedFile,
    processingStep,
    showReplaceDialog,
    pendingFile,
    getRootProps,
    getInputProps,
    isDragActive,
    handleReplaceConfirm,
    handleReplaceCancel,
    handleRemoveDocument,
    formatFileSize,
    error,
    setError
  }
}
