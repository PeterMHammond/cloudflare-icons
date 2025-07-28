const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test with R2 page
    await page.goto('https://developers.cloudflare.com/r2/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Find all SVGs on the page
    const svgs = await page.$$eval('svg', elements => 
      elements.map(el => ({
        html: el.outerHTML.substring(0, 200) + '...',
        classes: el.className,
        parentClasses: el.parentElement?.className || '',
        position: el.getBoundingClientRect(),
        isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
      }))
    );
    
    console.log(`Found ${svgs.length} SVGs on the page`);
    
    // Look for product icon specifically
    console.log('\nLooking for product icons in header area:');
    svgs.forEach((svg, index) => {
      if (svg.position.x < 300 && svg.position.y < 300 && svg.isVisible) {
        console.log(`\nSVG ${index}:`);
        console.log('Position:', svg.position);
        console.log('Classes:', svg.classes);
        console.log('Parent classes:', svg.parentClasses);
        console.log('HTML preview:', svg.html);
      }
    });
    
    // Check for specific selectors
    const testSelectors = [
      'header svg',
      '.docs-header svg',
      '[class*="product-icon"] svg',
      '[class*="ProductIcon"] svg',
      'a[href="/r2/"] svg',
      '.sidebar svg',
      'nav svg'
    ];
    
    console.log('\nTesting specific selectors:');
    for (const selector of testSelectors) {
      const count = await page.$$eval(selector, els => els.length);
      if (count > 0) {
        console.log(`${selector}: found ${count} elements`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();