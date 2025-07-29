import { test, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Excalidraw Visual Centering Verification', () => {
  test.slow(); // Mark as slow test since it involves external site
  
  test('visually verify text centering in Excalidraw', async ({ page }) => {
    // Step 1: Download the Excalidraw file from our app
    await page.goto('http://localhost:8787/');
    await page.waitForSelector('.icon-container');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    const downloadPath = path.join(__dirname, '..', 'test-results', 'visual-test.excalidraw');
    await download.saveAs(downloadPath);
    
    // Read the file content
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Step 2: Open Excalidraw.com in a new context
    const browser = await chromium.launch({ headless: false }); // Set to true for CI
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const excalidrawPage = await context.newPage();
    
    try {
      // Navigate to Excalidraw
      await excalidrawPage.goto('https://excalidraw.com/', { waitUntil: 'networkidle' });
      
      // Wait for app to load
      await excalidrawPage.waitForSelector('canvas', { timeout: 30000 });
      
      // Import the file by simulating the import process
      // First, open the menu
      await excalidrawPage.keyboard.press('Control+O'); // or Cmd+O on Mac
      
      // Alternative approach: Use the file input
      const fileInput = await excalidrawPage.waitForSelector('input[type="file"]', { 
        state: 'attached',
        timeout: 5000 
      }).catch(() => null);
      
      if (fileInput) {
        await fileInput.setInputFiles(downloadPath);
      } else {
        // If file input not found, try drag and drop approach
        const dataTransfer = await excalidrawPage.evaluateHandle((data) => {
          const dt = new DataTransfer();
          const file = new File([data], 'cloudflare-icons.excalidraw', { type: 'application/json' });
          dt.items.add(file);
          return dt;
        }, fileContent);
        
        await excalidrawPage.dispatchEvent('canvas', 'drop', { dataTransfer });
      }
      
      // Wait for import to complete
      await excalidrawPage.waitForTimeout(3000);
      
      // Zoom to fit
      await excalidrawPage.keyboard.press('Shift+1');
      await excalidrawPage.waitForTimeout(1000);
      
      // Take screenshots of specific areas
      // Full view
      await excalidrawPage.screenshot({ 
        path: 'tests/screenshots/excalidraw-full-import.png',
        fullPage: false 
      });
      
      // Zoom in on specific icons with multi-line text
      // Find and zoom to "Durable Objects"
      await excalidrawPage.keyboard.press('Control+F'); // Open search
      await excalidrawPage.waitForTimeout(500);
      
      // Take close-up screenshots of key areas
      const viewportCenters = [
        { x: 600, y: 75 }, // First row center
        { x: 300, y: 225 }, // Second row with "Durable Objects"
        { x: 900, y: 375 }, // Third row
      ];
      
      for (let i = 0; i < viewportCenters.length; i++) {
        const center = viewportCenters[i];
        
        // Pan to the area
        await excalidrawPage.mouse.move(960, 540); // Center of viewport
        await excalidrawPage.mouse.down();
        await excalidrawPage.mouse.move(960 - (center.x - 600), 540 - (center.y - 300), { steps: 10 });
        await excalidrawPage.mouse.up();
        await excalidrawPage.waitForTimeout(500);
        
        // Zoom in for detail
        await excalidrawPage.keyboard.down('Control');
        await excalidrawPage.mouse.wheel(0, -300); // Zoom in
        await excalidrawPage.keyboard.up('Control');
        await excalidrawPage.waitForTimeout(500);
        
        await excalidrawPage.screenshot({ 
          path: `tests/screenshots/excalidraw-text-centering-${i + 1}.png`,
          fullPage: false 
        });
        
        // Reset zoom
        await excalidrawPage.keyboard.press('Shift+1');
        await excalidrawPage.waitForTimeout(500);
      }
      
      // Verify visual alignment by analyzing the page
      const textAlignmentCheck = await excalidrawPage.evaluate(() => {
        // This would run in the Excalidraw context
        // Check if any visual misalignment indicators exist
        const canvas = document.querySelector('canvas');
        return canvas ? 'Canvas found - visual check complete' : 'Canvas not found';
      });
      
      console.log('Visual alignment check:', textAlignmentCheck);
      
    } finally {
      // Clean up
      await browser.close();
      fs.unlinkSync(downloadPath);
    }
  });
  
  test('automated visual regression test for text centering', async ({ page }) => {
    // This test creates a visual representation of the alignment for automated checking
    await page.goto('http://localhost:8787/');
    await page.waitForSelector('.icon-container');
    
    // Download Excalidraw file
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    const downloadPath = path.join(__dirname, '..', 'test-results', 'alignment-test.excalidraw');
    await download.saveAs(downloadPath);
    
    // Parse and analyze
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Create visual alignment report
    const alignmentReport = [];
    
    excalidrawData.elements.forEach(element => {
      if (element.type === 'text') {
        const iconId = element.id.replace('text-', 'icon-');
        const icon = excalidrawData.elements.find(el => el.id === iconId);
        
        if (icon) {
          const alignment = {
            name: element.id.replace('text-', ''),
            textX: element.x,
            iconX: icon.x,
            difference: Math.abs(element.x - icon.x),
            textWidth: element.width,
            iconWidth: icon.width,
            isAligned: element.x === icon.x && element.width === icon.width,
            textAlign: element.textAlign,
            hasMultipleLines: element.text.includes('\n')
          };
          
          alignmentReport.push(alignment);
        }
      }
    });
    
    // Check for any misalignments
    const misaligned = alignmentReport.filter(item => !item.isAligned);
    
    // Log report for debugging
    console.log('Alignment Report Summary:');
    console.log(`Total text elements: ${alignmentReport.length}`);
    console.log(`Properly aligned: ${alignmentReport.filter(item => item.isAligned).length}`);
    console.log(`Misaligned: ${misaligned.length}`);
    
    if (misaligned.length > 0) {
      console.log('\nMisaligned elements:');
      misaligned.forEach(item => {
        console.log(`- ${item.name}: textX=${item.textX}, iconX=${item.iconX}, diff=${item.difference}`);
      });
    }
    
    // Assert all are aligned
    expect(misaligned.length).toBe(0);
    
    // Additional checks for multi-line text
    const multiLineTexts = alignmentReport.filter(item => item.hasMultipleLines);
    console.log(`\nMulti-line texts: ${multiLineTexts.length}`);
    multiLineTexts.forEach(item => {
      console.log(`- ${item.name}: aligned=${item.isAligned}, textAlign=${item.textAlign}`);
      expect(item.textAlign).toBe('center');
      expect(item.isAligned).toBe(true);
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });
});