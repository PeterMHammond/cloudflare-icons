import { test } from '@playwright/test';

test('Test icon copy - first icon', async ({ page, context }) => {
  await page.goto('http://localhost:8787');
  await page.waitForLoadState('networkidle');
  
  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  // Get the first icon and right-click
  const firstIcon = await page.locator('.icon-container').first();
  await firstIcon.click({ button: 'right' });
  
  // Wait for clipboard operation
  await page.waitForTimeout(1000);
  
  // Read clipboard content
  const copiedSVG = await page.evaluate(async () => {
    const text = await navigator.clipboard.readText();
    return text;
  });
  
  console.log('Copied SVG:', copiedSVG);
});