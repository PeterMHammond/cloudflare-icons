import { test, expect } from '@playwright/test';

// Map of icons to their official documentation pages
const iconVerificationMap = {
  'turnstile': {
    url: 'https://developers.cloudflare.com/turnstile/',
    selector: '.DocSearch-Button svg', // The icon appears in the sidebar
    expectedViewBox: '0 0 54 54'
  },
  'd1': {
    url: 'https://developers.cloudflare.com/d1/',
    selector: '.DocSearch-Button svg',
    expectedViewBox: '0 0 16 16' // D1 uses 16x16
  },
  'workers': {
    url: 'https://developers.cloudflare.com/workers/',
    selector: '.DocSearch-Button svg',
    expectedViewBox: '0 0 48 48'
  },
  'r2': {
    url: 'https://developers.cloudflare.com/r2/',
    selector: '.DocSearch-Button svg',
    expectedViewBox: '0 0 48 48'
  },
  'pages': {
    url: 'https://developers.cloudflare.com/pages/',
    selector: '.DocSearch-Button svg',
    expectedViewBox: '0 0 48 48'
  },
  'cloudflare-zero-trust': {
    url: 'https://developers.cloudflare.com/cloudflare-one/',
    selector: '.DocSearch-Button svg',
    expectedViewBox: '0 0 48 48'
  }
};

test.describe('Verify Icons Against Official Sources', () => {
  test.beforeAll(async () => {
    console.log('Starting icon verification against official Cloudflare product pages...');
  });

  // Test each icon individually
  for (const [iconName, config] of Object.entries(iconVerificationMap)) {
    test(`verify ${iconName} icon matches official version`, async ({ page, context }) => {
      // Step 1: Get the official SVG from Cloudflare docs
      console.log(`\nChecking ${iconName} at ${config.url}`);
      
      await page.goto(config.url, { waitUntil: 'networkidle' });
      
      // Try to find the icon in the page
      let officialSvg = '';
      
      // Method 1: Try the selector
      const iconElement = await page.locator(config.selector).first();
      if (await iconElement.count() > 0) {
        officialSvg = await iconElement.evaluate(el => el.outerHTML);
      }
      
      // Method 2: Search for SVG with specific viewBox
      if (!officialSvg) {
        const svgs = await page.locator(`svg[viewBox="${config.expectedViewBox}"]`);
        if (await svgs.count() > 0) {
          officialSvg = await svgs.first().evaluate(el => el.outerHTML);
        }
      }
      
      // Method 3: Look for any product icon SVG
      if (!officialSvg) {
        const allSvgs = await page.locator('svg').all();
        for (const svg of allSvgs) {
          const html = await svg.evaluate(el => el.outerHTML);
          if (html.includes('currentColor') || html.includes('#f38020')) {
            officialSvg = html;
            console.log(`Found potential icon SVG for ${iconName}`);
            break;
          }
        }
      }
      
      if (officialSvg) {
        console.log(`Official ${iconName} SVG:`, officialSvg.substring(0, 100) + '...');
        
        // Step 2: Get our current SVG
        const ourPage = await context.newPage();
        await ourPage.goto('/');
        await ourPage.waitForLoadState('networkidle');
        
        const ourIconSelector = `[data-icon-name="${iconName}"]`;
        const ourIcon = await ourPage.locator(ourIconSelector).locator('svg').first();
        
        if (await ourIcon.count() > 0) {
          const ourSvg = await ourIcon.evaluate(el => el.outerHTML);
          console.log(`Our ${iconName} SVG:`, ourSvg.substring(0, 100) + '...');
          
          // Compare key attributes
          const officialViewBox = officialSvg.match(/viewBox="([^"]+)"/)?.[1];
          const ourViewBox = ourSvg.match(/viewBox="([^"]+)"/)?.[1];
          
          if (officialViewBox !== ourViewBox) {
            console.warn(`⚠️  ViewBox mismatch for ${iconName}:`);
            console.warn(`   Official: ${officialViewBox}`);
            console.warn(`   Ours: ${ourViewBox}`);
          }
          
          // Extract paths for comparison
          const officialPaths = officialSvg.match(/<path[^>]+>/g) || [];
          const ourPaths = ourSvg.match(/<path[^>]+>/g) || [];
          
          console.log(`Path count - Official: ${officialPaths.length}, Ours: ${ourPaths.length}`);
        }
        
        await ourPage.close();
      } else {
        console.warn(`⚠️  Could not find official SVG for ${iconName} at ${config.url}`);
      }
    });
  }

  test('capture screenshots of all icons for visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all icon names
    const iconElements = await page.locator('[data-icon-name]').all();
    console.log(`Found ${iconElements.length} icons to verify`);
    
    // Create a visual comparison grid
    for (let i = 0; i < iconElements.length; i += 6) {
      // Take screenshot of 6 icons at a time
      const batch = iconElements.slice(i, i + 6);
      if (batch.length > 0) {
        const firstIcon = batch[0];
        const lastIcon = batch[batch.length - 1];
        
        const firstBox = await firstIcon.boundingBox();
        const lastBox = await lastIcon.boundingBox();
        
        if (firstBox && lastBox) {
          await page.screenshot({
            path: `tests/screenshots/icon-batch-${Math.floor(i/6)}.png`,
            clip: {
              x: firstBox.x - 10,
              y: firstBox.y - 10,
              width: (lastBox.x + lastBox.width) - firstBox.x + 20,
              height: Math.max(firstBox.height, lastBox.height) + 20
            }
          });
        }
      }
    }
  });
});

// Additional test to check specific known issues
test('verify known problematic icons', async ({ page, context }) => {
  const problematicIcons = [
    {
      name: 'turnstile',
      officialUrl: 'https://developers.cloudflare.com/turnstile/',
      expectedViewBox: '0 0 54 54',
      notes: 'Should not have transform scale'
    }
  ];
  
  for (const icon of problematicIcons) {
    console.log(`\n🔍 Checking ${icon.name} (${icon.notes})`);
    
    // Check our version
    await page.goto('/');
    const ourIcon = await page.locator(`[data-icon-name="${icon.name}"]`).locator('svg').first();
    const ourSvg = await ourIcon.evaluate(el => el.outerHTML);
    
    console.log('Our SVG:', ourSvg);
    
    // Verify no transform scale
    if (ourSvg.includes('transform="scale')) {
      console.error(`❌ ${icon.name} still has transform scale!`);
    } else {
      console.log(`✅ ${icon.name} correctly has no transform scale`);
    }
    
    // Verify correct viewBox
    const viewBoxMatch = ourSvg.match(/viewBox="([^"]+)"/);
    if (viewBoxMatch && viewBoxMatch[1] === icon.expectedViewBox) {
      console.log(`✅ ${icon.name} has correct viewBox: ${icon.expectedViewBox}`);
    } else {
      console.error(`❌ ${icon.name} has incorrect viewBox: ${viewBoxMatch?.[1]}`);
    }
  }
});