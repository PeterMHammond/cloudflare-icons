const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test with R2 page
    await page.goto('https://developers.cloudflare.com/r2/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Get header SVGs
    const headerSVGs = await page.$$eval('header svg', elements => 
      elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          html: el.outerHTML,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          viewBox: el.getAttribute('viewBox'),
          classes: el.className,
          parentTag: el.parentElement?.tagName,
          parentClasses: el.parentElement?.className || '',
          grandparentClasses: el.parentElement?.parentElement?.className || ''
        };
      })
    );
    
    console.log('Header SVGs:');
    headerSVGs.forEach((svg, index) => {
      console.log(`\n=== SVG ${index} ===`);
      console.log('Position:', `x=${svg.x}, y=${svg.y}`);
      console.log('Size:', `${svg.width}x${svg.height}`);
      console.log('ViewBox:', svg.viewBox);
      console.log('Classes:', svg.classes);
      console.log('Parent:', svg.parentTag, svg.parentClasses);
      console.log('Grandparent classes:', svg.grandparentClasses);
      if (svg.html.length < 500) {
        console.log('Full SVG:', svg.html);
      } else {
        console.log('SVG preview:', svg.html.substring(0, 300) + '...');
      }
    });
    
    // Also check the specific R2 link
    const r2LinkSVG = await page.$eval('a[href="/r2/"] svg', el => ({
      html: el.outerHTML,
      rect: el.getBoundingClientRect()
    }));
    
    console.log('\n=== R2 Link SVG ===');
    console.log('Position:', r2LinkSVG.rect);
    console.log('SVG:', r2LinkSVG.html);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();