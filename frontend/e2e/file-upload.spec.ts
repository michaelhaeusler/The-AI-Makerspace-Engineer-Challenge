import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and enter API key
    await page.goto('/');
    await page.getByTestId('api-key-input-field').fill('sk-test-api-key-for-testing');
    await page.getByTestId('api-key-continue-button').click();
  });

  test('should show file upload area', async ({ page }) => {
    // Should see upload area - use test ID to avoid ambiguity
    await expect(page.getByTestId('file-upload-area')).toBeVisible();
    await expect(page.getByText('Drag and drop or click to select a PDF file')).toBeVisible();
  });

  test('should show upload area as clickable', async ({ page }) => {
    const uploadArea = page.getByTestId('file-upload-area');
    await expect(uploadArea).toBeVisible();
    await expect(uploadArea).toHaveAttribute('role', 'button');
  });

  test('should show progress bar during upload simulation', async ({ page }) => {
    // Create a mock PDF file
    const fileContent = Buffer.from('Mock PDF content for testing');

    // Set up file chooser handler
    page.on('filechooser', async (fileChooser) => {
      // Create a temporary file path
      const testFilePath = path.join(__dirname, 'test-document.pdf');
      await fileChooser.setFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    // Click upload area to trigger file chooser
    await page.getByTestId('file-upload-area').click();

    // Should show progress elements (even if simulated)
    await expect(page.getByTestId('file-upload-progress')).toBeVisible({ timeout: 10000 });
  });

  test('should show document info after upload', async ({ page }) => {
    // Mock successful upload by setting up network response
    await page.route('/api/upload-pdf-only', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          filename: 'test-document.pdf',
          num_chunks: 50,
          message: 'Successfully processed test-document.pdf'
        }),
      });
    });

    // Mock chat response for summary
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: '# Document Summary\n\nThis is a test document summary.',
      });
    });

    // Create mock file
    const fileContent = Buffer.from('Mock PDF content');
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    // Trigger upload
    await page.getByTestId('file-upload-area').click();

    // Should eventually show document info
    await expect(page.getByTestId('file-uploaded-info')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('file-uploaded-name')).toContainText('test-document.pdf');
  });

  test('should show remove button for uploaded document', async ({ page }) => {
    // Mock successful upload and summary
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
        body: 'Test summary',
      });
    });

    // Upload file
    const fileContent = Buffer.from('Mock PDF');
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    await page.getByTestId('file-upload-area').click();

    // Should show remove button
    await expect(page.getByTestId('file-remove-button')).toBeVisible({ timeout: 15000 });
  });

  test('should remove document when X is clicked', async ({ page }) => {
    // Mock responses
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
        body: 'Test summary',
      });
    });

    await page.route('/api/clear-document', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success' }),
      });
    });

    // Upload and then remove
    const fileContent = Buffer.from('Mock PDF');
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    await page.getByTestId('file-upload-area').click();

    // Wait for document to appear and click remove
    await expect(page.getByTestId('file-remove-button')).toBeVisible({ timeout: 15000 });
    await page.getByTestId('file-remove-button').click();

    // Document should be removed
    await expect(page.getByTestId('file-uploaded-info')).not.toBeVisible();
    await expect(page.getByText('Start a conversation')).toBeVisible();
  });
});
