import { test, expect } from '@playwright/test';

test('Test icon copy functionality', async ({ page, context }) => {
  await page.goto('http://localhost:8787');
  await page.waitForLoadState('networkidle');
  
  // Find the D1 icon (which has 16x16 viewBox)
  const d1Icon = await page.locator('.icon-container').filter({ hasText: 'D1' });
  await expect(d1Icon).toBeVisible();
  
  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  
  // Right-click on D1 icon
  await d1Icon.click({ button: 'right' });
  
  // Wait for clipboard operation
  await page.waitForTimeout(1000);
  
  // Read clipboard content
  const copiedSVG = await page.evaluate(async () => {
    const text = await navigator.clipboard.readText();
    return text;
  });
  
  console.log('Copied SVG:', copiedSVG);
  
  // Check if it contains the transform
  const hasTransform = copiedSVG.includes('transform');
  const hasViewBox48 = copiedSVG.includes('viewBox="0 0 48 48"');
  
  console.log('Has transform:', hasTransform);
  console.log('Has viewBox 48x48:', hasViewBox48);
});