import { test, expect } from '@playwright/test';

test('verify Turnstile icon has been fixed', async ({ page }) => {
  // Navigate to the local page
  await page.goto('http://localhost:8787/');
  await page.waitForLoadState('networkidle');
  
  // Find the Turnstile icon (note: name is capitalized)
  const turnstileIcon = await page.locator('[data-icon-name="Turnstile"]').first();
  await expect(turnstileIcon).toBeVisible();
  
  // Get the SVG element
  const svgElement = await turnstileIcon.locator('svg').first();
  const svgHtml = await svgElement.evaluate(el => el.outerHTML);
  
  console.log('Turnstile SVG:', svgHtml);
  
  // Verify the SVG has the correct viewBox
  expect(svgHtml).toContain('viewBox="0 0 54 54"');
  
  // Verify it does NOT have transform scale
  expect(svgHtml).not.toContain('transform="scale');
  expect(svgHtml).not.toContain('<g transform=');
  
  // Verify it has the correct paths
  expect(svgHtml).toContain('M27.315 7.261');
  expect(svgHtml).toContain('M38.847 21.919');
  
  // Take a screenshot of the Turnstile icon
  await turnstileIcon.screenshot({ 
    path: 'tests/screenshots/turnstile-fixed.png' 
  });
  
  console.log('✅ Turnstile icon has been successfully fixed!');
  console.log('   - Correct viewBox: 0 0 54 54');
  console.log('   - No transform scale');
  console.log('   - Correct path data from official source');
});