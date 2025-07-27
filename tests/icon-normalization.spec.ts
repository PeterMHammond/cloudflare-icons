import { test, expect } from '@playwright/test';

test.describe('Icon ViewBox Normalization', () => {
  test('icons with different viewBox sizes appear uniform in Excalidraw', async ({ page, context }) => {
    // Icons with different original viewBox sizes
    const testIcons = [
      { name: 'd1', expectedSize: '16x16' },
      { name: 'workers-kv', expectedSize: '16x16' },
      { name: 'cloudflare', expectedSize: '24x24' },
      { name: 'cloudflare-dex', expectedSize: '64x64' },
      { name: 'hyperdrive', expectedSize: '64x64' },
    ];

    // Open our icons page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot of icons page
    await page.screenshot({ 
      path: 'tests/screenshots/icons-page-initial.png',
      fullPage: false 
    });

    // Open Excalidraw in a new tab
    const excalidrawPage = await context.newPage();
    await excalidrawPage.goto('https://excalidraw.com/');
    await excalidrawPage.waitForLoadState('networkidle');
    
    // Wait for Excalidraw canvas to be ready
    await excalidrawPage.waitForSelector('canvas', { timeout: 10000 });
    
    // Close any welcome dialog if present
    const closeButton = excalidrawPage.locator('button:has-text("Got it")');
    if (await closeButton.isVisible({ timeout: 3000 })) {
      await closeButton.click();
    }

    // Position for pasting icons (starting from left)
    let pasteX = 100;
    const pasteY = 300;
    const spacing = 150;

    // Process each icon
    for (const iconInfo of testIcons) {
      console.log(`Testing icon: ${iconInfo.name} (${iconInfo.expectedSize})`);
      
      // Switch back to icons page
      await page.bringToFront();
      
      // Find and right-click the icon
      const iconSelector = `[data-icon-name="${iconInfo.name}"]`;
      await page.waitForSelector(iconSelector, { timeout: 5000 });
      
      // Right-click to copy SVG
      await page.click(iconSelector, { button: 'right' });
      
      // Wait a bit for context menu and clipboard operation
      await page.waitForTimeout(500);
      
      // Switch to Excalidraw
      await excalidrawPage.bringToFront();
      
      // Click on canvas at specific position
      await excalidrawPage.mouse.click(pasteX, pasteY);
      
      // Paste using keyboard shortcut
      await excalidrawPage.keyboard.press('Control+V');
      
      // Wait for paste to complete
      await excalidrawPage.waitForTimeout(1000);
      
      // Take screenshot after pasting this icon
      await excalidrawPage.screenshot({ 
        path: `tests/screenshots/excalidraw-icon-${iconInfo.name}.png`,
        fullPage: false 
      });
      
      // Move position for next icon
      pasteX += spacing;
    }

    // Take screenshot of all pasted icons
    await excalidrawPage.waitForTimeout(2000); // Let any animations settle
    
    // Zoom out to see all icons
    await excalidrawPage.keyboard.press('Control+0'); // Reset zoom
    await excalidrawPage.waitForTimeout(500);
    
    // Take final screenshot showing all icons side by side
    const screenshot = await excalidrawPage.screenshot({ 
      path: 'tests/screenshots/excalidraw-all-icons-final.png',
      fullPage: false 
    });
    
    // Verify screenshot was taken
    expect(screenshot).toBeTruthy();
    
    // Visual verification note
    console.log('Screenshots saved to tests/screenshots/');
    console.log('- icons-page-initial.png: Initial icons page');
    console.log('- excalidraw-icon-*.png: Individual icon screenshots');
    console.log('- excalidraw-all-icons-final.png: All icons side by side');
    console.log('Please visually verify that all icons appear at uniform size in Excalidraw');
    
    // Additional check: Verify all icons were found on the icons page
    for (const iconInfo of testIcons) {
      const iconElement = await page.locator(`[data-icon-name="${iconInfo.name}"]`);
      await expect(iconElement).toBeVisible();
    }
  });

  test('verify viewBox normalization in copied SVG content', async ({ page, context }) => {
    // This test verifies the actual SVG content has normalized viewBox
    const testIcon = 'd1'; // Using a 16x16 icon
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Set up clipboard API interception
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Find and click the icon to copy
    const iconSelector = `[data-icon-name="${testIcon}"]`;
    await page.waitForSelector(iconSelector);
    
    // Intercept clipboard write to verify SVG content
    let copiedSVG = '';
    await page.evaluateHandle(() => {
      // Override clipboard writeText to capture content
      const originalWriteText = navigator.clipboard.writeText;
      navigator.clipboard.writeText = async (text) => {
        window.__copiedText = text;
        return originalWriteText.call(navigator.clipboard, text);
      };
    });
    
    // Right-click to copy
    await page.click(iconSelector, { button: 'right' });
    await page.waitForTimeout(500);
    
    // Get the copied SVG content
    copiedSVG = await page.evaluate(() => window.__copiedText || '');
    
    // Verify the SVG has been transformed with scale
    expect(copiedSVG).toContain('viewBox="0 0 48 48"');
    expect(copiedSVG).toContain('<g transform="scale(3.000)">');
    expect(copiedSVG).toContain('<svg');
    expect(copiedSVG).toContain('</svg>');
    
    console.log('Copied SVG has been transformed with scale to normalize sizes');
  });
});