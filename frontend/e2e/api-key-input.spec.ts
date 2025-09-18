import { test, expect } from '@playwright/test';

test.describe('API Key Input Flow', () => {
  test('should show API key input screen on first visit', async ({ page }) => {
    await page.goto('/');

    // Should see the API key input screen
    await expect(page.getByText('RAG Chat')).toBeVisible();
    await expect(page.getByText('Enter your OpenAI API key to continue')).toBeVisible();
    await expect(page.getByPlaceholder('sk-...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('should disable continue button when API key is empty', async ({ page }) => {
    await page.goto('/');

    const continueButton = page.getByRole('button', { name: 'Continue' });
    await expect(continueButton).toBeDisabled();
  });

  test('should enable continue button when API key is entered', async ({ page }) => {
    await page.goto('/');

    const apiKeyInput = page.getByPlaceholder('sk-...');
    const continueButton = page.getByRole('button', { name: 'Continue' });

    // Enter a mock API key
    await apiKeyInput.fill('sk-test-api-key-for-testing');
    await expect(continueButton).toBeEnabled();
  });

  test('should proceed to main app when continue is clicked', async ({ page }) => {
    await page.goto('/');

    // Fill API key and continue
    await page.getByPlaceholder('sk-...').fill('sk-test-api-key-for-testing');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should see the main app interface
    await expect(page.getByText('AI-powered document chat')).toBeVisible();
    await expect(page.getByText('Upload a PDF document').first()).toBeVisible();
    await expect(page.getByText('Start a conversation')).toBeVisible();
  });
});
