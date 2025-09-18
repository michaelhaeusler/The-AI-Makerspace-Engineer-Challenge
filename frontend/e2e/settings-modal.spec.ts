import { test, expect } from '@playwright/test';

test.describe('Settings Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and enter API key
    await page.goto('/');
    await page.getByPlaceholder('sk-...').fill('sk-test-api-key-for-testing');
    await page.getByRole('button', { name: 'Continue' }).click();
  });

  test('should open settings modal when settings button is clicked', async ({ page }) => {
    // Click settings button
    await page.getByTitle('Settings').click();

    // Should see settings modal
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByText('Language Model')).toBeVisible();
    await expect(page.getByText('Theme Color')).toBeVisible();
  });

  test('should show available models in settings', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Should see model options - use more specific selectors
    await expect(page.getByRole('button', { name: 'GPT-4o Mini Fast & efficient' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'GPT-4o Most capable' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'GPT-3.5 Turbo Classic choice' })).toBeVisible();
  });

  test('should show available colors in settings', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Should see color options
    await expect(page.getByText('Blue')).toBeVisible();
    await expect(page.getByText('Emerald')).toBeVisible();
    await expect(page.getByText('Purple')).toBeVisible();
  });

  test('should allow model selection', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Click on GPT-4o model - use the specific button
    await page.getByRole('button', { name: 'GPT-4o Most capable' }).click();

    // Should be selected (visual indication)
    const gpt4Button = page.getByRole('button', { name: 'GPT-4o Most capable' });
    await expect(gpt4Button).toHaveClass(/border-.*-300/);
  });

  test('should allow color selection', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Click on Purple color
    await page.getByText('Purple').click();

    // Should be selected (visual indication)
    const purpleButton = page.locator('button:has-text("Purple")');
    await expect(purpleButton).toHaveClass(/border-purple-300/);
  });

  test('should close settings modal when done button is clicked', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Click done button
    await page.getByRole('button', { name: 'Done' }).click();

    // Settings modal should be closed
    await expect(page.getByText('Language Model')).not.toBeVisible();
  });

  test('should close settings modal when X button is clicked', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Click X button - look for the close button in the modal header
    await page.locator('.fixed .p-6 button').first().click();

    // Settings modal should be closed
    await expect(page.getByText('Language Model')).not.toBeVisible();
  });

  test('should persist color selection after modal close', async ({ page }) => {
    await page.getByTitle('Settings').click();

    // Select blue color
    await page.getByText('Blue').click();
    await page.getByRole('button', { name: 'Done' }).click();

    // Reopen settings
    await page.getByTitle('Settings').click();

    // Blue should still be selected
    const blueButton = page.locator('button:has-text("Blue")');
    await expect(blueButton).toHaveClass(/border-blue-300/);
  });
});
