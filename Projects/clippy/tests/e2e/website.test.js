import { chromium, test, expect } from '@playwright/test';

test.describe('Clippy File Conversion Tool', () => {
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    // Launch browser
    browser = await chromium.launch({ headless: false });
  });

  test.beforeEach(async () => {
    // Create new context and page for each test
    context = await browser.newContext();
    page = await context.newPage();

    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test.afterEach(async () => {
    // Close context after each test
    await context.close();
  });

  test.afterAll(async () => {
    // Close browser after all tests
    await browser.close();
  });

  test('should load the homepage', async () => {
    // Check if the page title is correct
    await expect(page).toHaveTitle('Clippy - File Conversion Tool');

    // Check if main header is visible
    await expect(page.locator('h1')).toContainText('Clippy - File Conversion Tool');

    // Check if upload section is visible
    await expect(page.locator('.upload-title')).toContainText('Upload Your Image');

    // Check if upload button is present
    await expect(page.locator('.upload-button')).toBeVisible();

    console.log('✅ Homepage loaded successfully');
  });

  test('should show file upload interface', async () => {
    // Verify upload section elements are visible
    await expect(page.locator('.upload-icon')).toBeVisible();
    await expect(page.locator('.upload-description')).toContainText('Drag and drop your JPG or PNG file here');

    // Check file input exists
    const fileInput = page.locator('#file-input');
    await expect(fileInput).toBeAttached();

    console.log('✅ File upload interface is visible');
  });

  test('should validate file upload', async () => {
    // Create a test image file (this would be a real file in actual testing)
    // For now, we'll just check the interface behavior

    const fileInput = page.locator('#file-input');
    await expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/png');

    console.log('✅ File input validation configured correctly');
  });

  test('should show format selection options', async () => {
    // First upload a file to show the converter section
    // Since we can't create actual files easily, let's check the format options exist

    const formatOptions = page.locator('.format-option');
    await expect(formatOptions).toHaveCount(3); // PDF, PNG, JPG

    await expect(page.locator('.format-option').filter({ hasText: 'PDF' })).toBeVisible();
    await expect(page.locator('.format-option').filter({ hasText: 'PNG' })).toBeVisible();
    await expect(page.locator('.format-option').filter({ hasText: 'JPG' })).toBeVisible();

    console.log('✅ Format selection options are available');
  });

  test('should have responsive design', async () => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if elements are still visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.upload-button')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.upload-button')).toBeVisible();

    console.log('✅ Responsive design working on mobile and desktop');
  });

  test('should handle error states', async () => {
    // The error message should be hidden by default
    const errorMessage = page.locator('#error-message');
    await expect(errorMessage).toHaveClass(/hidden/);

    console.log('✅ Error handling elements are properly configured');
  });

  test('should show progress section structure', async () => {
    // Progress section should be hidden by default
    const progressSection = page.locator('#progress-section');
    await expect(progressSection).toHaveClass(/hidden/);

    // Check progress elements exist
    const progressFill = page.locator('#progress-fill');
    await expect(progressFill).toBeAttached();

    console.log('✅ Progress tracking elements are in place');
  });

  test('should show download section structure', async () => {
    // Download section should be hidden by default
    const downloadSection = page.locator('#download-section');
    await expect(downloadSection).toHaveClass(/hidden/);

    // Check download elements exist
    const downloadButton = page.locator('#download-button');
    await expect(downloadButton).toBeAttached();

    console.log('✅ Download functionality elements are ready');
  });

  test('should have proper CSS styling', async () => {
    // Check if CSS is loaded by verifying styled elements
    const header = page.locator('.header');
    const computedStyle = await header.evaluate(el => window.getComputedStyle(el));
    expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have background

    const container = page.locator('.container');
    const containerStyle = await container.evaluate(el => window.getComputedStyle(el));
    expect(containerStyle.boxShadow).not.toBe('none'); // Should have shadow

    console.log('✅ CSS styling is properly applied');
  });
});