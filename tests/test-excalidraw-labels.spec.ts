import { test, expect } from '@playwright/test';

test('excalidraw export includes labels for each icon', async ({ page }) => {
  // Start the dev server first
  await page.goto('http://localhost:8787');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the viewer page icons don't have labels (they should be 80x80px containers)
  const iconContainers = await page.locator('.icon-container').all();
  expect(iconContainers.length).toBeGreaterThan(0);
  
  // Get the first icon container and check its dimensions
  const firstContainer = iconContainers[0];
  const box = await firstContainer.boundingBox();
  expect(box?.width).toBe(80);
  expect(box?.height).toBe(80);
  
  // Now download the Excalidraw backup and check it contains labels
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Download Excalidraw Backup")');
  const download = await downloadPromise;
  
  // Read the downloaded file
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const content = Buffer.concat(chunks).toString('utf-8');
  const excalidrawData = JSON.parse(content);
  
  // Check that we have elements
  expect(excalidrawData.elements).toBeDefined();
  expect(excalidrawData.elements.length).toBeGreaterThan(0);
  
  // Find text elements (they should exist for labels)
  const textElements = excalidrawData.elements.filter(el => el.type === 'text');
  const imageElements = excalidrawData.elements.filter(el => el.type === 'image');
  
  // We should have equal number of text and image elements
  expect(textElements.length).toBe(imageElements.length);
  expect(textElements.length).toBeGreaterThan(0);
  
  // Check that text elements contain lowercase labels
  const workersText = textElements.find(el => el.text === 'workers');
  expect(workersText).toBeDefined();
  expect(workersText.fontSize).toBe(16);
  expect(workersText.fontFamily).toBe(5); // Excalifont
  
  // Check grouping - each icon and its label should be in the same group
  const workersIcon = imageElements.find(el => el.id.includes('workers'));
  expect(workersIcon).toBeDefined();
  expect(workersIcon.groupIds).toBeDefined();
  expect(workersText.groupIds).toEqual(workersIcon.groupIds);
  
  console.log('✅ Excalidraw export correctly includes labels for all icons');
});