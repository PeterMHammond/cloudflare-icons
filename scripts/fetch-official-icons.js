const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Comprehensive list of Cloudflare products and their documentation URLs
const productPages = [
  { name: '1.1.1.1', url: 'https://developers.cloudflare.com/1.1.1.1/' },
  { name: 'access', url: 'https://developers.cloudflare.com/cloudflare-one/applications/' },
  { name: 'ai-gateway', url: 'https://developers.cloudflare.com/ai-gateway/' },
  { name: 'browser-rendering', url: 'https://developers.cloudflare.com/browser-rendering/' },
  { name: 'cache', url: 'https://developers.cloudflare.com/cache/' },
  { name: 'cloudflare-pages', url: 'https://developers.cloudflare.com/pages/' },
  { name: 'cloudflare-tunnel', url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/' },
  { name: 'cloudflare-workers', url: 'https://developers.cloudflare.com/workers/' },
  { name: 'cloudflare-zero-trust', url: 'https://developers.cloudflare.com/cloudflare-one/' },
  { name: 'd1', url: 'https://developers.cloudflare.com/d1/' },
  { name: 'ddos-protection', url: 'https://developers.cloudflare.com/ddos-protection/' },
  { name: 'dex', url: 'https://developers.cloudflare.com/analytics/analytics-engine/' },
  { name: 'dns', url: 'https://developers.cloudflare.com/dns/' },
  { name: 'email-routing', url: 'https://developers.cloudflare.com/email-routing/' },
  { name: 'email-security', url: 'https://developers.cloudflare.com/email-security/' },
  { name: 'gateway', url: 'https://developers.cloudflare.com/cloudflare-one/policies/gateway/' },
  { name: 'hyperdrive', url: 'https://developers.cloudflare.com/hyperdrive/' },
  { name: 'images', url: 'https://developers.cloudflare.com/images/' },
  { name: 'load-balancing', url: 'https://developers.cloudflare.com/load-balancing/' },
  { name: 'magic-firewall', url: 'https://developers.cloudflare.com/magic-firewall/' },
  { name: 'magic-transit', url: 'https://developers.cloudflare.com/magic-transit/' },
  { name: 'magic-wan', url: 'https://developers.cloudflare.com/magic-wan/' },
  { name: 'pages', url: 'https://developers.cloudflare.com/pages/' },
  { name: 'pub-sub', url: 'https://developers.cloudflare.com/pub-sub/' },
  { name: 'queues', url: 'https://developers.cloudflare.com/queues/' },
  { name: 'r2', url: 'https://developers.cloudflare.com/r2/' },
  { name: 'registrar', url: 'https://developers.cloudflare.com/registrar/' },
  { name: 'ruleset-engine', url: 'https://developers.cloudflare.com/ruleset-engine/' },
  { name: 'spectrum', url: 'https://developers.cloudflare.com/spectrum/' },
  { name: 'ssl-tls', url: 'https://developers.cloudflare.com/ssl/' },
  { name: 'stream', url: 'https://developers.cloudflare.com/stream/' },
  { name: 'turnstile', url: 'https://developers.cloudflare.com/turnstile/' },
  { name: 'vectorize', url: 'https://developers.cloudflare.com/vectorize/' },
  { name: 'waf', url: 'https://developers.cloudflare.com/waf/' },
  { name: 'waiting-room', url: 'https://developers.cloudflare.com/waiting-room/' },
  { name: 'warp', url: 'https://developers.cloudflare.com/warp-client/' },
  { name: 'web-analytics', url: 'https://developers.cloudflare.com/analytics/web-analytics/' },
  { name: 'workers', url: 'https://developers.cloudflare.com/workers/' },
  { name: 'workers-ai', url: 'https://developers.cloudflare.com/workers-ai/' },
  { name: 'zaraz', url: 'https://developers.cloudflare.com/zaraz/' }
];

async function extractIconFromPage(page, productName, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);
    
    // Strategy 1: Look for product icon in the sidebar or header
    const selectors = [
      'nav svg', // Navigation icons
      'aside svg', // Sidebar icons
      'header svg', // Header icons
      '.docs-sidebar svg', // Documentation sidebar
      '[class*="icon"] svg', // Class containing "icon"
      '[class*="product"] svg', // Class containing "product"
      'svg[viewBox]' // Any SVG with viewBox
    ];
    
    let bestIcon = null;
    let bestScore = 0;
    
    for (const selector of selectors) {
      const svgs = await page.locator(selector).all();
      
      for (const svg of svgs) {
        try {
          const svgHtml = await svg.evaluate(el => el.outerHTML);
          const viewBox = svgHtml.match(/viewBox="([^"]+)"/)?.[1];
          
          // Score the SVG based on various criteria
          let score = 0;
          
          // Prefer specific viewBox sizes
          if (viewBox === '0 0 54 54') score += 10; // Turnstile size
          if (viewBox === '0 0 48 48') score += 8;  // Standard size
          if (viewBox === '0 0 16 16') score += 6;  // Small size
          if (viewBox === '0 0 64 64') score += 6;  // Large size
          
          // Prefer SVGs with paths
          const pathCount = (svgHtml.match(/<path/g) || []).length;
          if (pathCount > 0) score += 5;
          if (pathCount > 1) score += 2;
          
          // Prefer SVGs with currentColor or Cloudflare orange
          if (svgHtml.includes('currentColor')) score += 3;
          if (svgHtml.includes('#f38020')) score += 3;
          
          // Avoid tiny icons (UI elements)
          if (viewBox && viewBox.includes('24 24')) score -= 2;
          if (viewBox && viewBox.includes('20 20')) score -= 3;
          
          // Avoid icons that are clearly not product icons
          if (svgHtml.includes('chevron') || svgHtml.includes('arrow') || svgHtml.includes('close')) {
            score = 0;
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestIcon = svgHtml;
          }
        } catch (e) {
          // Skip this SVG
        }
      }
    }
    
    if (bestIcon && bestScore > 5) {
      console.log(`✅ Found icon for ${productName} (score: ${bestScore})`);
      return bestIcon;
    } else {
      console.log(`⚠️  No suitable icon found for ${productName} at ${url}`);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error fetching ${productName}: ${error.message}`);
    return null;
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const results = {};
  
  console.log('Fetching official Cloudflare product icons...\n');
  
  for (const product of productPages) {
    const page = await context.newPage();
    const icon = await extractIconFromPage(page, product.name, product.url);
    
    if (icon) {
      results[product.name] = {
        svg: icon,
        url: product.url,
        viewBox: icon.match(/viewBox="([^"]+)"/)?.[1]
      };
    }
    
    await page.close();
    
    // Be nice to the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save results
  const outputPath = path.join(__dirname, '..', 'official-icons.json');
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n📁 Results saved to: ${outputPath}`);
  console.log(`📊 Found ${Object.keys(results).length} out of ${productPages.length} icons`);
  
  // Generate comparison report
  const report = [];
  report.push('# Official Icon Comparison Report\n');
  report.push(`Found ${Object.keys(results).length} official icons\n`);
  
  for (const [name, data] of Object.entries(results)) {
    report.push(`## ${name}`);
    report.push(`- URL: ${data.url}`);
    report.push(`- ViewBox: ${data.viewBox}`);
    report.push(`- SVG Preview: \`${data.svg.substring(0, 100)}...\``);
    report.push('');
  }
  
  const reportPath = path.join(__dirname, '..', 'icon-comparison-report.md');
  await fs.writeFile(reportPath, report.join('\n'));
  
  console.log(`📄 Report saved to: ${reportPath}`);
  
  await browser.close();
}

main().catch(console.error);