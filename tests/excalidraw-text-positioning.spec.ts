import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Excalidraw Text Positioning', () => {
  test('text elements should be properly centered below icons', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Download the Excalidraw file
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    // Save to a temporary location
    const downloadPath = path.join(__dirname, '..', 'test-results', 'text-positioning-test.excalidraw');
    await download.saveAs(downloadPath);
    
    // Read and parse the downloaded file
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Get all image and text elements
    const imageElements = excalidrawData.elements.filter(el => el.type === 'image');
    const textElements = excalidrawData.elements.filter(el => el.type === 'text');
    
    // Verify we have both icons and text elements
    expect(imageElements.length).toBeGreaterThan(0);
    expect(textElements.length).toBe(imageElements.length);
    
    // Create maps for easier lookup
    const imageMap = new Map();
    imageElements.forEach(img => {
      // Extract icon name from ID (format: "cf-icon-name")
      const name = img.id.replace('cf-icon-', '');
      imageMap.set(name, img);
    });
    
    // Test each text element
    textElements.forEach(text => {
      // Extract name from text ID (format: "text-name")
      const name = text.id.replace('text-', '');
      const correspondingIcon = imageMap.get(name);
      
      expect(correspondingIcon).toBeDefined();
      
      // Verify text x-coordinate matches icon x-coordinate
      expect(text.x).toBe(correspondingIcon.x);
      
      // Verify text width matches icon width
      expect(text.width).toBe(correspondingIcon.width);
      
      // Verify text is positioned below icon (with proper spacing)
      const expectedY = correspondingIcon.y + correspondingIcon.height + -3.5; // 48 height + spacing
      expect(text.y).toBeCloseTo(expectedY, 1);
      
      // Verify text alignment is center
      expect(text.textAlign).toBe('center');
      
      // Verify other text properties
      expect(text.verticalAlign).toBe('top');
      expect(text.fontSize).toBe(16);
      expect(text.fontFamily).toBe(5); // Excalidraw's Virgil font
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });

  test('multi-line text should maintain center alignment', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Download the Excalidraw file
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    // Save to a temporary location
    const downloadPath = path.join(__dirname, '..', 'test-results', 'multiline-text-test.excalidraw');
    await download.saveAs(downloadPath);
    
    // Read and parse the downloaded file
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Find specific multi-line text cases
    const textElements = excalidrawData.elements.filter(el => el.type === 'text');
    const multiLineTexts = textElements.filter(text => {
      return text.text && text.text.includes('\n');
    });
    
    // Test known multi-line cases
    const durableObjectsText = textElements.find(text => text.id === 'text-durable-objects');
    if (durableObjectsText) {
      expect(durableObjectsText.text).toBe('durable\nobjects');
      expect(durableObjectsText.textAlign).toBe('center');
      expect(durableObjectsText.height).toBeGreaterThan(20); // Should be taller for 2 lines
      
      // Find corresponding icon
      const durableObjectsIcon = excalidrawData.elements.find(el => el.id === 'cf-icon-durable-objects');
      expect(durableObjectsIcon).toBeDefined();
      expect(durableObjectsText.x).toBe(durableObjectsIcon.x);
      expect(durableObjectsText.width).toBe(durableObjectsIcon.width);
    }
    
    // Verify all multi-line texts have proper alignment
    multiLineTexts.forEach(text => {
      expect(text.textAlign).toBe('center');
      expect(text.verticalAlign).toBe('top');
      
      // Extract corresponding icon
      const iconName = text.id.replace('text-', '');
      const iconId = `cf-icon-${iconName}`;
      const icon = excalidrawData.elements.find(el => el.id === iconId);
      
      expect(icon).toBeDefined();
      expect(text.x).toBe(icon.x);
      expect(text.width).toBe(icon.width);
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });

  test('text positioning should work correctly in grid layout', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Download the Excalidraw file
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    // Save to a temporary location
    const downloadPath = path.join(__dirname, '..', 'test-results', 'grid-layout-test.excalidraw');
    await download.saveAs(downloadPath);
    
    // Read and parse the downloaded file
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Get all elements sorted by their position
    const elements = excalidrawData.elements;
    const iconTextPairs = [];
    
    // Group icons with their corresponding text
    elements.forEach(el => {
      if (el.type === 'image') {
        const name = el.id.replace('cf-icon-', '');
        const textEl = elements.find(t => t.id === `text-${name}`);
        if (textEl) {
          iconTextPairs.push({ icon: el, text: textEl, name });
        }
      }
    });
    
    // Sort by position (top-left to bottom-right)
    iconTextPairs.sort((a, b) => {
      if (a.icon.y !== b.icon.y) return a.icon.y - b.icon.y;
      return a.icon.x - b.icon.x;
    });
    
    // Verify grid positioning (10 columns, 150px spacing)
    iconTextPairs.forEach((pair, index) => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      
      const expectedX = col * 150;
      const expectedY = row * 150;
      
      // Check icon position
      expect(pair.icon.x).toBe(expectedX);
      expect(pair.icon.y).toBe(expectedY);
      
      // Check text position relative to icon
      expect(pair.text.x).toBe(pair.icon.x);
      expect(pair.text.y).toBeCloseTo(pair.icon.y + pair.icon.height + -3.5, 1);
      
      // Verify consistent spacing
      if (col < 9) { // Not last column
        const nextPair = iconTextPairs[index + 1];
        if (nextPair && row === Math.floor((index + 1) / 10)) {
          expect(nextPair.icon.x - pair.icon.x).toBe(150);
        }
      }
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });

  test('all text elements should have consistent styling', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Download the Excalidraw file
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    // Save to a temporary location
    const downloadPath = path.join(__dirname, '..', 'test-results', 'text-styling-test.excalidraw');
    await download.saveAs(downloadPath);
    
    // Read and parse the downloaded file
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Get all text elements
    const textElements = excalidrawData.elements.filter(el => el.type === 'text');
    
    // Verify consistent styling across all text elements
    textElements.forEach(text => {
      // Font properties
      expect(text.fontSize).toBe(16);
      expect(text.fontFamily).toBe(5); // Virgil in Excalidraw
      
      // Alignment
      expect(text.textAlign).toBe('center');
      expect(text.verticalAlign).toBe('top');
      
      // Visual properties
      expect(text.strokeColor).toBe('#1e1e1e');
      expect(text.backgroundColor).toBe('transparent');
      expect(text.fillStyle).toBe('solid');
      expect(text.strokeWidth).toBe(2);
      expect(text.strokeStyle).toBe('solid');
      expect(text.roughness).toBe(1);
      expect(text.opacity).toBe(100);
      
      // Other properties
      expect(text.angle).toBe(0);
      expect(text.isDeleted).toBe(false);
      
      // Width should match icon width
      expect(text.width).toBe(48);
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });
});