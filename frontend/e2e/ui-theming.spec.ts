import { test, expect } from '@playwright/test';

test.describe('UI Theming and Visual Elements', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and enter API key
    await page.goto('/');
    await page.getByPlaceholder('sk-...').fill('sk-test-api-key-for-testing');
    await page.getByRole('button', { name: 'Continue' }).click();
  });

  test('should apply theme color to UI elements', async ({ page }) => {
    // Open settings and select blue theme
    await page.getByTitle('Settings').click();
    await page.getByText('Blue').click();
    await page.getByRole('button', { name: 'Done' }).click();

    // Check that send button has blue styling
    const sendButton = page.locator('button:has(svg)').last();
    await expect(sendButton).toHaveClass(/bg-blue-600/);
  });

  test('should persist theme selection across page reloads', async ({ page }) => {
    // Select purple theme
    await page.getByTitle('Settings').click();
    await page.getByText('Purple').click();
    await page.getByRole('button', { name: 'Done' }).click();

    // Reload page
    await page.reload();

    // Enter API key again (since it's not persisted in tests)
    await page.getByPlaceholder('sk-...').fill('sk-test-api-key-for-testing');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Check that purple theme is still applied
    await page.getByTitle('Settings').click();
    const purpleButton = page.locator('button:has-text("Purple")');
    await expect(purpleButton).toHaveClass(/border-purple-300/);
  });

  test('should show progress bar with theme color', async ({ page }) => {
    // Select emerald theme
    await page.getByTitle('Settings').click();
    await page.getByText('Emerald').click();
    await page.getByRole('button', { name: 'Done' }).click();

    // Mock file upload to trigger progress bar
    await page.route('/api/upload-pdf-only', async (route) => {
      // Delay response to see progress bar
      await new Promise(resolve => setTimeout(resolve, 2000));
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
        body: 'Summary',
      });
    });

    // Trigger upload
    const fileContent = Buffer.from('Mock PDF');
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    await page.locator('[role="button"]').filter({ hasText: 'Upload a PDF document' }).click();

    // Should see progress bar with emerald color
    const progressBar = page.locator('[data-slot="progress-indicator"]');
    await expect(progressBar).toBeVisible({ timeout: 5000 });
    await expect(progressBar).toHaveClass(/bg-emerald-600/);
  });

  test('should show proper visual hierarchy', async ({ page }) => {
    // Check header elements
    await expect(page.getByText('RAG Chat')).toBeVisible();
    await expect(page.getByText('AI-powered document chat')).toBeVisible();

    // Check main content areas
    await expect(page.getByText('Upload a PDF document')).toBeVisible();
    await expect(page.getByText('Start a conversation')).toBeVisible();

    // Check that elements have proper styling classes
    const header = page.locator('h1:has-text("RAG Chat")');
    await expect(header).toHaveClass(/text-xl.*font-semibold/);
  });

  test('should show loading states with theme colors', async ({ page }) => {
    // Select red theme
    await page.getByTitle('Settings').click();
    await page.getByText('Red').click();
    await page.getByRole('button', { name: 'Done' }).click();

    // Mock delayed chat response
    await page.route('/api/chat', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Response',
      });
    });

    // Send message to trigger loading
    const messageInput = page.getByPlaceholder('Type your message...');
    await messageInput.fill('Test message');
    await messageInput.press('Enter');

    // Should show loading with red theme
    const loadingSpinner = page.locator('.animate-spin');
    await expect(loadingSpinner).toBeVisible();
    await expect(loadingSpinner).toHaveClass(/text-red-600/);
  });

  test('should handle responsive design elements', async ({ page }) => {
    // Test with different viewport sizes
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet size

    // Elements should still be visible and properly arranged
    await expect(page.getByText('RAG Chat')).toBeVisible();
    await expect(page.getByText('Upload a PDF document')).toBeVisible();
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();

    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size

    // Should still work on mobile
    await expect(page.getByText('RAG Chat')).toBeVisible();
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
  });

  test('should show proper focus states', async ({ page }) => {
    const messageInput = page.getByPlaceholder('Type your message...');

    // Focus the input
    await messageInput.focus();

    // Should have focus styling
    await expect(messageInput).toBeFocused();
    await expect(messageInput).toHaveClass(/focus:border-neutral-400/);
  });
});
