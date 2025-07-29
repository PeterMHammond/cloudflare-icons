import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Excalidraw Download', () => {
  test('should download a valid Excalidraw file with all 44 icons', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Verify we have 44 icons loaded
    const iconCount = await page.locator('.icon-container').count();
    expect(iconCount).toBe(44);
    
    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Click the download button
    await page.click('button:has-text("Download Excalidraw Backup")');
    
    // Wait for the download to complete
    const download = await downloadPromise;
    
    // Save to a temporary location
    const downloadPath = path.join(__dirname, '..', 'test-results', 'cloudflare-icons.excalidraw');
    await download.saveAs(downloadPath);
    
    // Read and parse the downloaded file
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Verify the structure
    expect(excalidrawData).toHaveProperty('type', 'excalidraw');
    expect(excalidrawData).toHaveProperty('version', 2);
    expect(excalidrawData).toHaveProperty('source', 'cloudflare-icons');
    expect(excalidrawData).toHaveProperty('elements');
    expect(excalidrawData).toHaveProperty('files');
    expect(excalidrawData).toHaveProperty('appState');
    
    // Verify we have 44 elements
    expect(excalidrawData.elements).toHaveLength(44);
    
    // Verify we have 44 files
    const fileKeys = Object.keys(excalidrawData.files);
    expect(fileKeys).toHaveLength(44);
    
    // Verify each element has proper structure
    excalidrawData.elements.forEach((element, index) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('type', 'image');
      expect(element).toHaveProperty('x');
      expect(element).toHaveProperty('y');
      expect(element).toHaveProperty('width', 48);
      expect(element).toHaveProperty('height', 48);
      expect(element).toHaveProperty('fileId');
      
      // Verify fileId exists in files
      const fileId = element.fileId;
      expect(fileId in excalidrawData.files).toBe(true);
      
      // Verify file has proper structure
      const file = excalidrawData.files[fileId];
      expect(file).toHaveProperty('mimeType', 'image/svg+xml');
      expect(file).toHaveProperty('id', fileId);
      expect(file).toHaveProperty('dataURL');
      expect(file.dataURL).toMatch(/^data:image\/svg\+xml;base64,/);
      
      // Verify the base64 content is not empty
      const base64Part = file.dataURL.replace('data:image/svg+xml;base64,', '');
      expect(base64Part.length).toBeGreaterThan(0);
      
      // Decode and verify it's valid SVG
      const svgContent = Buffer.from(base64Part, 'base64').toString('utf-8');
      expect(svgContent).toContain('<svg');
      expect(svgContent).toContain('</svg>');
    });
    
    // Verify grid layout (10 columns)
    excalidrawData.elements.forEach((element, index) => {
      const expectedX = (index % 10) * 150;
      const expectedY = Math.floor(index / 10) * 150;
      expect(element.x).toBe(expectedX);
      expect(element.y).toBe(expectedY);
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });
  
  test('downloaded file should be importable in Excalidraw format', async ({ page }) => {
    // Navigate to the icons page
    await page.goto('http://localhost:8787/');
    
    // Wait for icons to load
    await page.waitForSelector('.icon-container');
    
    // Download the file
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download Excalidraw Backup")');
    const download = await downloadPromise;
    
    // Save and read the file
    const downloadPath = path.join(__dirname, '..', 'test-results', 'cloudflare-icons-import-test.excalidraw');
    await download.saveAs(downloadPath);
    const fileContent = fs.readFileSync(downloadPath, 'utf-8');
    const excalidrawData = JSON.parse(fileContent);
    
    // Verify it follows Excalidraw's expected format for import
    // Based on Excalidraw's schema, we need:
    // 1. Valid element types
    // 2. File references that match
    // 3. Proper coordinate system
    
    // Check that all required top-level properties exist
    expect(excalidrawData.type).toBe('excalidraw');
    expect(excalidrawData.version).toBe(2);
    expect(Array.isArray(excalidrawData.elements)).toBe(true);
    expect(typeof excalidrawData.files).toBe('object');
    
    // Verify no duplicate IDs
    const elementIds = excalidrawData.elements.map(el => el.id);
    const uniqueIds = new Set(elementIds);
    expect(uniqueIds.size).toBe(elementIds.length);
    
    // Verify all file references are valid
    const fileIds = new Set(Object.keys(excalidrawData.files));
    excalidrawData.elements.forEach(element => {
      if (element.type === 'image' && element.fileId) {
        expect(fileIds.has(element.fileId)).toBe(true);
      }
    });
    
    // Clean up
    fs.unlinkSync(downloadPath);
  });
});