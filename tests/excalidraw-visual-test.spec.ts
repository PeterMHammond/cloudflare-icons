import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Excalidraw Export Visual Test', () => {
  test('capture download functionality screenshot', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Take a screenshot showing the download button
    await page.screenshot({ 
      path: 'tests/screenshots/excalidraw-download-button.png',
      fullPage: false 
    });
    
    // Hover over the download button for visual feedback
    await page.hover('button:has-text("Download Excalidraw Backup")');
    
    // Take screenshot with hover state
    await page.screenshot({ 
      path: 'tests/screenshots/excalidraw-download-hover.png',
      fullPage: false 
    });
    
    // Click download and verify toast message
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    
    // Wait for toast to appear
    await page.waitForSelector('.toast.show', { timeout: 5000 });
    
    // Capture toast message
    await page.screenshot({ 
      path: 'tests/screenshots/excalidraw-download-success.png',
      fullPage: false 
    });
    
    // Wait for download to complete
    const download = await downloadPromise;
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toBe('cloudflare-icons.excalidraw');
    
    // Save the file for manual inspection
    const downloadPath = path.join(__dirname, '..', 'test-results', 'sample-export.excalidraw');
    await download.saveAs(downloadPath);
    
    console.log(`✅ Download test completed. File saved as: ${downloadPath}`);
    console.log('📸 Screenshots saved in tests/screenshots/');
  });
});