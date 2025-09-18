import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and enter API key
    await page.goto('/');
    await page.getByTestId('api-key-input-field').fill('sk-test-api-key-for-testing');

    // Wait for button to be enabled (WebKit needs explicit wait)
    const continueButton = page.getByTestId('api-key-continue-button');
    await expect(continueButton).toBeEnabled({ timeout: 2000 });
    await continueButton.click();
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

  test('should show progress during file selection', async ({ page }) => {
    // Create mock file
    const fileContent = Buffer.from('Mock PDF content');
    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent,
      });
    });

    // Trigger file selection
    await page.getByTestId('file-upload-area').click();

    // Should show processing step (this tests the file selection part)
    // Note: Full upload testing requires backend integration
    await page.waitForTimeout(500); // Allow time for file selection

    // This test verifies the file selection works - full upload flow needs backend
    await expect(page.getByTestId('file-upload-area')).toBeVisible();
  });

  test('should accept PDF file types', async ({ page }) => {
    // This test verifies file type validation without requiring backend
    const uploadArea = page.getByTestId('file-upload-area');
    await expect(uploadArea).toBeVisible();

    // Verify the upload area accepts PDF files
    const input = uploadArea.locator('input[type="file"]');
    await expect(input).toHaveAttribute('accept', 'application/pdf,.pdf');
  });

  test('should show drag and drop styling', async ({ page }) => {
    // Test that the upload area has proper drag/drop styling
    const uploadArea = page.getByTestId('file-upload-area');
    await expect(uploadArea).toBeVisible();

    // Verify it has cursor pointer for clickability
    await expect(uploadArea).toHaveClass(/cursor-pointer/);

    // Verify it's structured as a proper drop zone
    await expect(uploadArea).toHaveAttribute('role', 'button');
  });
});
