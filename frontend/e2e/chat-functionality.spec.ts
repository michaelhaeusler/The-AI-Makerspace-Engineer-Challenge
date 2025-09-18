import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and enter API key
    await page.goto('/');
    await page.getByTestId('api-key-input-field').fill('sk-test-api-key-for-testing');
    await page.getByTestId('api-key-continue-button').click();
  });

  test('should show chat interface elements', async ({ page }) => {
    // Should see chat input area - use test IDs
    await expect(page.getByTestId('chat-input-field')).toBeVisible();
    await expect(page.getByTestId('chat-send-button')).toBeVisible();
  });

  test('should disable send button when input is empty', async ({ page }) => {
    const sendButton = page.getByTestId('chat-send-button');
    await expect(sendButton).toBeDisabled();
  });

  test('should enable send button when message is typed', async ({ page }) => {
    const messageInput = page.getByTestId('chat-input-field');
    const sendButton = page.getByTestId('chat-send-button');

    await messageInput.fill('Hello, this is a test message');
    await expect(sendButton).toBeEnabled();
  });

  test('should send message when send button is clicked', async ({ page }) => {
    // Mock chat API response
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Hello! This is a test response from the AI.',
      });
    });

    const messageInput = page.getByTestId('chat-input-field');
    const sendButton = page.getByTestId('chat-send-button');

    // Type and send message
    await messageInput.fill('Hello AI!');
    await sendButton.click();

    // Should see the user message in chat
    await expect(page.getByTestId('chat-message-user')).toContainText('Hello AI!');

    // Should eventually see AI response
    await expect(page.getByTestId('chat-message-assistant')).toContainText('Hello! This is a test response from the AI.');
  });

  test('should send message when Enter is pressed', async ({ page }) => {
    // Mock chat API response
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Response via Enter key.',
      });
    });

    const messageInput = page.getByTestId('chat-input-field');

    // Type message and press Enter
    await messageInput.fill('Test Enter key');
    await messageInput.press('Enter');

    // Should see both messages
    await expect(page.getByTestId('chat-message-user')).toContainText('Test Enter key');
    await expect(page.getByTestId('chat-message-assistant')).toContainText('Response via Enter key.');
  });

  test('should show loading indicator while waiting for response', async ({ page }) => {
    // Mock delayed response
    await page.route('/api/chat', async (route) => {
      // Delay the response to see loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Delayed response',
      });
    });

    const messageInput = page.getByTestId('chat-input-field');
    const sendButton = page.getByTestId('chat-send-button');

    await messageInput.fill('Test loading');
    await sendButton.click();

    // Should show loading indicator
    await expect(page.getByTestId('chat-loading-indicator')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    const messageInput = page.getByTestId('chat-input-field');
    const sendButton = page.getByTestId('chat-send-button');

    await messageInput.fill('This will cause an error');
    await sendButton.click();

    // Should show error message
    await expect(page.getByTestId('error-alert')).toContainText('Failed to send message');
  });

  test('should show different placeholder for RAG mode', async ({ page }) => {
    // Mock file upload to enter RAG mode
    await page.route('/api/upload-pdf-only', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success', filename: 'test.pdf' }),
      });
    });

    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Document summary',
      });
    });

    // Upload a file
    const fileContent = Buffer.from('Mock PDF');
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    await page.getByTestId('file-upload-area').click();

    // Should show RAG mode placeholder
    await expect(page.getByPlaceholder('Ask a question about your document...')).toBeVisible({ timeout: 15000 });
  });

  test('should clear input after sending message', async ({ page }) => {
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Response',
      });
    });

    const messageInput = page.getByTestId('chat-input-field');

    await messageInput.fill('Test message');
    await messageInput.press('Enter');

    // Input should be cleared
    await expect(messageInput).toHaveValue('');
  });
});
