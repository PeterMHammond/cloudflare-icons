import { test } from '@playwright/test';

test('debug HTML structure', async ({ page }) => {
  await page.goto('http://localhost:8787/');
  await page.waitForLoadState('networkidle');
  
  // Wait for icons to load
  await page.waitForTimeout(2000);
  
  // Get the HTML of the icons grid
  const gridHtml = await page.locator('#iconsGrid').innerHTML();
  console.log('Icons Grid HTML (first 500 chars):', gridHtml.substring(0, 500));
  
  // Count icon containers
  const iconCount = await page.locator('.icon-container').count();
  console.log('Number of icon containers:', iconCount);
  
  // Get the first icon container's HTML
  if (iconCount > 0) {
    const firstIcon = await page.locator('.icon-container').first();
    const firstIconHtml = await firstIcon.evaluate(el => el.outerHTML);
    console.log('First icon HTML:', firstIconHtml);
  }
  
  // Look specifically for turnstile
  const turnstileCount = await page.locator('[data-name="turnstile"]').count();
  console.log('Turnstile icons found with data-name:', turnstileCount);
  
  // Alternative selector
  const turnstileCount2 = await page.locator('[data-icon-name="turnstile"]').count();
  console.log('Turnstile icons found with data-icon-name:', turnstileCount2);
});