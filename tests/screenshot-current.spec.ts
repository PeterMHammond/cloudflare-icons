import { test } from '@playwright/test';

test('Take current screenshot', async ({ page }) => {
  await page.goto('http://localhost:8787');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tests/screenshots/current-state.png', fullPage: true });
});