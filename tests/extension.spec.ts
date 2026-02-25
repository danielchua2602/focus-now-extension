import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let context: BrowserContext;

test.beforeAll(async () => {
  // Build the extension first (make sure dist folder exists)
  const pathToExtension = path.join(__dirname, '..', 'dist');

  // Launch browser with extension loaded
  context = await chromium.launchPersistentContext('', {
    headless: false, // Extensions require headful mode
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
});

test.afterAll(async () => {
  await context.close();
});

test.describe('Focus Now Extension Workflow', () => {
  test('should load extension, add youtube.com to block list, create schedule, and verify blocking', async () => {
    // Step 1: Get the extension popup page
    const extensionId = await getExtensionId(context);
    const popupUrl = `chrome-extension://${extensionId}/src/popup/index.html`;

    // Open the popup
    const page = await context.newPage();
    await page.goto(popupUrl);

    // Verify popup loaded
    await expect(page.locator('text=Focus Now')).toBeVisible();

    // Step 2: Open the Add Schedule modal
    const addButton = page.locator('button:has-text("Add Schedule")').first();
    await addButton.click();

    // Verify modal opened
    await expect(page.locator('h2:has-text("Add Schedule")')).toBeVisible();

    // Step 3: Add 'youtube.com' to the block list via the schedule form
    const websiteInput = page.locator('input[placeholder="example.com"]');
    await websiteInput.fill('youtube.com');

    // Step 4: Create a schedule for today - use a simple all-day schedule for reliability
    // Click the toggle label to enable all-day mode
    const allDayLabel = page.locator('label:has-text("All-day")');
    await allDayLabel.click();

    // Wait for UI to update and hide time inputs
    await page.waitForTimeout(500);

    // Submit the form
    const saveButton = page.locator('button:has-text("Save Schedule")');
    await saveButton.click();

    // Wait for modal to close
    await expect(page.locator('h2:has-text("Add Schedule")')).not.toBeVisible({
      timeout: 3000,
    });

    // Verify the schedule appears in the list (check the p tag with the website)
    await expect(
      page.locator('p.text-gray-600:has-text("youtube.com")')
    ).toBeVisible({ timeout: 5000 });

    // Give the background script time to update blocking rules

    // Give the background script time to update blocking rules
    // Increased wait time to ensure background script processes the update
    await page.waitForTimeout(5000);

    const youtubePage = await context.newPage();

    try {
      await youtubePage.goto('https://www.youtube.com', {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });
    } catch (_error) {
      // Might timeout if redirected immediately
      // Navigation may have been blocked by redirect
    }

    // Wait for potential redirect
    await youtubePage.waitForTimeout(2000);

    // Check if we're on the blocked page
    const currentUrl = youtubePage.url();

    const isBlocked =
      currentUrl.includes('blocked.html') ||
      currentUrl.includes('src/blocked/') ||
      (currentUrl.startsWith('chrome-extension://') &&
        !currentUrl.includes('youtube'));

    // If not blocked, log the URL for debugging
    if (!isBlocked) {
      // Page was not blocked — test will fail below
    }

    expect(isBlocked).toBeTruthy();

    await youtubePage.close();
    await page.close();
  });

  test('should create an all-day schedule', async () => {
    const extensionId = await getExtensionId(context);
    const popupUrl = `chrome-extension://${extensionId}/src/popup/index.html`;

    const page = await context.newPage();
    await page.goto(popupUrl);

    // Open Add Schedule modal
    const addButton = page.locator('button:has-text("Add Schedule")').first();
    await addButton.click();

    // Verify modal opened
    await expect(page.locator('h2:has-text("Add Schedule")')).toBeVisible();

    // Fill in website
    const websiteInput = page.locator('input[placeholder="example.com"]');
    await websiteInput.fill('facebook.com');

    // Click the toggle label (not the hidden checkbox)
    const allDayLabel = page.locator('label:has-text("All-day")');
    await allDayLabel.click();

    // Wait for UI to update
    await page.waitForTimeout(500);

    // Verify time inputs are hidden when all-day is enabled
    const timeInputs = page.locator('input[type="time"]');
    await expect(timeInputs.first()).not.toBeVisible();

    // Submit the form
    const saveButton = page.locator('button:has-text("Save Schedule")');
    await saveButton.click();

    // Wait for modal to close and schedule to appear
    await page.waitForTimeout(1000);

    // Verify the schedule appears
    await expect(page.locator('text=facebook.com').first()).toBeVisible({
      timeout: 5000,
    });

    await page.close();
  });
});

/**
 * Helper function to get the extension ID
 */
async function getExtensionId(context: BrowserContext): Promise<string> {
  // Navigate to chrome://extensions to find the extension ID
  const page = await context.newPage();
  await page.goto('chrome://extensions');

  // Enable developer mode if not already enabled
  await page.evaluate(() => {
    const devModeToggle = document
      .querySelector('extensions-manager')
      ?.shadowRoot?.querySelector('extensions-toolbar')
      ?.shadowRoot?.querySelector('#devMode') as HTMLElement;
    if (
      devModeToggle &&
      !(devModeToggle as unknown as HTMLInputElement).checked
    ) {
      devModeToggle.click();
    }
  });

  // Get extension ID
  const extensionId = await page.evaluate(() => {
    const extensionsManager = document.querySelector('extensions-manager');
    const itemsList = extensionsManager?.shadowRoot?.querySelector(
      'extensions-item-list'
    );
    const items = itemsList?.shadowRoot?.querySelectorAll('extensions-item');

    if (items) {
      for (const item of Array.from(items)) {
        const nameElement = item.shadowRoot?.querySelector('#name');
        if (nameElement?.textContent?.includes('Focus Now')) {
          return item.getAttribute('id');
        }
      }
    }
    return null;
  });

  await page.close();

  if (!extensionId) {
    throw new Error(
      'Extension not found. Make sure the extension is built and loaded.'
    );
  }

  return extensionId;
}
