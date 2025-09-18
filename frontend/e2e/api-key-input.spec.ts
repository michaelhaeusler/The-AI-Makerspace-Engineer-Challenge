import { test, expect } from '@playwright/test';

test.describe('API Key Input Flow', () => {
  test('should show API key input screen on first visit', async ({ page }) => {
    await page.goto('/');

    // Should see the API key input screen
    await expect(page.getByText('RAG Chat')).toBeVisible();
    await expect(page.getByText('Enter your OpenAI API key to continue')).toBeVisible();
    await expect(page.getByTestId('api-key-input-field')).toBeVisible();
    await expect(page.getByTestId('api-key-continue-button')).toBeVisible();
  });

  test('should disable continue button when API key is empty', async ({ page }) => {
    await page.goto('/');

    const continueButton = page.getByTestId('api-key-continue-button');
    await expect(continueButton).toBeDisabled();
  });

  test('should enable continue button when API key is entered', async ({ page }) => {
    await page.goto('/');

    const apiKeyInput = page.getByTestId('api-key-input-field');
    const continueButton = page.getByTestId('api-key-continue-button');

    // Enter a mock API key
    await apiKeyInput.fill('sk-test-api-key-for-testing');
    await expect(continueButton).toBeEnabled();
  });

  test('should proceed to main app when continue is clicked', async ({ page }) => {
    await page.goto('/');

    // Fill API key and continue
    await page.getByTestId('api-key-input-field').fill('sk-test-api-key-for-testing');
    await page.getByTestId('api-key-continue-button').click();

    // Should see the main app interface
    await expect(page.getByText('AI-powered document chat')).toBeVisible();
    await expect(page.getByTestId('file-upload-area')).toBeVisible();
    await expect(page.getByText('Start a conversation')).toBeVisible();
  });
});
