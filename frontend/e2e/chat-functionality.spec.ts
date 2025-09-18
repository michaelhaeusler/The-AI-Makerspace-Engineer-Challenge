import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and enter API key
    await page.goto('/');
    await page.getByPlaceholder('sk-...').fill('sk-test-api-key-for-testing');
    await page.getByRole('button', { name: 'Continue' }).click();
  });

  test('should show chat interface elements', async ({ page }) => {
    // Should see chat input area
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
    await expect(page.getByRole('button').filter({ hasText: 'Send' })).toBeVisible();
  });

  test('should disable send button when input is empty', async ({ page }) => {
    const sendButton = page.locator('button:has(svg)').last(); // Send button with icon
    await expect(sendButton).toBeDisabled();
  });

  test('should enable send button when message is typed', async ({ page }) => {
    const messageInput = page.getByPlaceholder('Type your message...');
    const sendButton = page.locator('button:has(svg)').last();

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

    const messageInput = page.getByPlaceholder('Type your message...');
    const sendButton = page.locator('button:has(svg)').last();

    // Type and send message
    await messageInput.fill('Hello AI!');
    await sendButton.click();

    // Should see the user message
    await expect(page.getByText('Hello AI!')).toBeVisible();

    // Should eventually see AI response
    await expect(page.getByText('Hello! This is a test response from the AI.')).toBeVisible({ timeout: 10000 });
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

    const messageInput = page.getByPlaceholder('Type your message...');

    // Type message and press Enter
    await messageInput.fill('Test Enter key');
    await messageInput.press('Enter');

    // Should see both messages
    await expect(page.getByText('Test Enter key')).toBeVisible();
    await expect(page.getByText('Response via Enter key.')).toBeVisible({ timeout: 10000 });
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

    const messageInput = page.getByPlaceholder('Type your message...');
    const sendButton = page.locator('button:has(svg)').last();

    await messageInput.fill('Test loading');
    await sendButton.click();

    // Should show loading indicator
    await expect(page.getByText('AI is thinking...')).toBeVisible();
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

    const messageInput = page.getByPlaceholder('Type your message...');
    const sendButton = page.locator('button:has(svg)').last();

    await messageInput.fill('This will cause an error');
    await sendButton.click();

    // Should show error message
    await expect(page.getByText('Failed to send message')).toBeVisible({ timeout: 10000 });
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

    await page.locator('[role="button"]').filter({ hasText: 'Upload a PDF document' }).click();

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

    const messageInput = page.getByPlaceholder('Type your message...');

    await messageInput.fill('Test message');
    await messageInput.press('Enter');

    // Input should be cleared
    await expect(messageInput).toHaveValue('');
  });
});
