// Playwright script for verifying and updating Cloudflare icons
// This script can be run with parallel execution for efficiency

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Icon metadata with documentation URLs
const icons = [
  { name: '1.1.1.1', url: 'https://developers.cloudflare.com/1.1.1.1/', filename: '1.1.1.1.svg' },
  { name: 'access', url: 'https://developers.cloudflare.com/cloudflare-one/applications/', filename: 'access.svg' },
  { name: 'ai-gateway', url: 'https://developers.cloudflare.com/ai-gateway/', filename: 'ai-gateway.svg' },
  { name: 'analytics-engine', url: 'https://developers.cloudflare.com/analytics/analytics-engine/', filename: 'analytics-engine.svg' },
  { name: 'api-shield', url: 'https://developers.cloudflare.com/api-shield/', filename: 'api-shield.svg' },
  { name: 'argo', url: 'https://developers.cloudflare.com/argo-smart-routing/', filename: 'argo.svg' },
  { name: 'bot-management', url: 'https://developers.cloudflare.com/bots/', filename: 'bot-management.svg' },
  { name: 'browser-isolation', url: 'https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/', filename: 'browser-isolation.svg' },
  { name: 'browser-rendering', url: 'https://developers.cloudflare.com/browser-rendering/', filename: 'browser-rendering.svg' },
  { name: 'cache', url: 'https://developers.cloudflare.com/cache/', filename: 'cache.svg' },
  { name: 'cache-reserve', url: 'https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/', filename: 'cache-reserve.svg' },
  { name: 'calls', url: 'https://developers.cloudflare.com/calls/', filename: 'calls.svg' },
  { name: 'casb', url: 'https://developers.cloudflare.com/cloudflare-one/applications/scan-apps/', filename: 'casb.svg' },
  { name: 'cloudflare-one', url: 'https://developers.cloudflare.com/cloudflare-one/', filename: 'cloudflare-one.svg' },
  { name: 'cloudflare-pages', url: 'https://developers.cloudflare.com/pages/', filename: 'cloudflare-pages.svg' },
  { name: 'cloudflare-zero-trust', url: 'https://developers.cloudflare.com/cloudflare-one/', filename: 'cloudflare-zero-trust.svg' },
  { name: 'd1', url: 'https://developers.cloudflare.com/d1/', filename: 'd1.svg' },
  { name: 'ddos-protection', url: 'https://developers.cloudflare.com/ddos-protection/', filename: 'ddos-protection.svg' },
  { name: 'dlp', url: 'https://developers.cloudflare.com/cloudflare-one/policies/data-loss-prevention/', filename: 'dlp.svg' },
  { name: 'dns', url: 'https://developers.cloudflare.com/dns/', filename: 'dns.svg' },
  { name: 'dnssec', url: 'https://developers.cloudflare.com/dns/dnssec/', filename: 'dnssec.svg' },
  { name: 'durable-objects', url: 'https://developers.cloudflare.com/durable-objects/', filename: 'durable-objects.svg' },
  { name: 'email-routing', url: 'https://developers.cloudflare.com/email-routing/', filename: 'email-routing.svg' },
  { name: 'email-security', url: 'https://developers.cloudflare.com/email-security/', filename: 'email-security.svg' },
  { name: 'hyperdrive', url: 'https://developers.cloudflare.com/hyperdrive/', filename: 'hyperdrive.svg' },
  { name: 'images', url: 'https://developers.cloudflare.com/images/', filename: 'images.svg' },
  { name: 'kv', url: 'https://developers.cloudflare.com/kv/', filename: 'kv.svg' },
  { name: 'load-balancing', url: 'https://developers.cloudflare.com/load-balancing/', filename: 'load-balancing.svg' },
  { name: 'logs', url: 'https://developers.cloudflare.com/logs/', filename: 'logs.svg' },
  { name: 'magic-firewall', url: 'https://developers.cloudflare.com/magic-firewall/', filename: 'magic-firewall.svg' },
  { name: 'magic-transit', url: 'https://developers.cloudflare.com/magic-transit/', filename: 'magic-transit.svg' },
  { name: 'magic-wan', url: 'https://developers.cloudflare.com/magic-wan/', filename: 'magic-wan.svg' },
  { name: 'network-interconnect', url: 'https://developers.cloudflare.com/network-interconnect/', filename: 'network-interconnect.svg' },
  { name: 'observatory', url: 'https://developers.cloudflare.com/speed/observatory/', filename: 'observatory.svg' },
  { name: 'page-shield', url: 'https://developers.cloudflare.com/page-shield/', filename: 'page-shield.svg' },
  { name: 'pipelines', url: 'https://developers.cloudflare.com/pipelines/', filename: 'pipelines.svg' },
  { name: 'pub-sub', url: 'https://developers.cloudflare.com/pub-sub/', filename: 'pub-sub.svg' },
  { name: 'queues', url: 'https://developers.cloudflare.com/queues/', filename: 'queues.svg' },
  { name: 'r2', url: 'https://developers.cloudflare.com/r2/', filename: 'r2.svg' },
  { name: 'radar', url: 'https://developers.cloudflare.com/radar/', filename: 'radar.svg' },
  { name: 'registrar', url: 'https://developers.cloudflare.com/registrar/', filename: 'registrar.svg' },
  { name: 'security-center', url: 'https://developers.cloudflare.com/security-center/', filename: 'security-center.svg' },
  { name: 'spectrum', url: 'https://developers.cloudflare.com/spectrum/', filename: 'spectrum.svg' },
  { name: 'ssl', url: 'https://developers.cloudflare.com/ssl/', filename: 'ssl.svg' },
  { name: 'stream', url: 'https://developers.cloudflare.com/stream/', filename: 'stream.svg' },
  { name: 'time-services', url: 'https://developers.cloudflare.com/time-services/', filename: 'time-services.svg' },
  { name: 'tunnel', url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/', filename: 'tunnel.svg' },
  { name: 'turnstile', url: 'https://developers.cloudflare.com/turnstile/', filename: 'turnstile.svg' },
  { name: 'vectorize', url: 'https://developers.cloudflare.com/vectorize/', filename: 'vectorize.svg' },
  { name: 'waiting-room', url: 'https://developers.cloudflare.com/waiting-room/', filename: 'waiting-room.svg' },
  { name: 'waf', url: 'https://developers.cloudflare.com/waf/', filename: 'waf.svg' },
  { name: 'warp', url: 'https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/', filename: 'warp.svg' },
  { name: 'workers', url: 'https://developers.cloudflare.com/workers/', filename: 'workers.svg' },
  { name: 'workers-ai', url: 'https://developers.cloudflare.com/workers-ai/', filename: 'workers-ai.svg' },
  { name: 'workers-for-platforms', url: 'https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/', filename: 'workers-for-platforms.svg' },
  { name: 'zaraz', url: 'https://developers.cloudflare.com/zaraz/', filename: 'zaraz.svg' }
];

// Function to standardize SVG format
function standardizeSVG(svgContent) {
  let standardized = svgContent;
  
  // Extract content from symbol if present
  const symbolMatch = svgContent.match(/<symbol[^>]*>([\s\S]*?)<\/symbol>/);
  if (symbolMatch) {
    // Get the symbol content
    const symbolContent = symbolMatch[1];
    
    // Extract viewBox from symbol if present
    const viewBoxMatch = svgContent.match(/<symbol[^>]*viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    
    // Create new SVG with the symbol content
    standardized = `<svg viewBox="${viewBox}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${symbolContent}</svg>`;
  } else {
    // Remove any defs sections
    standardized = standardized.replace(/<defs[^>]*>.*?<\/defs>/gs, '');
    
    // Ensure viewBox
    if (!standardized.includes('viewBox')) {
      standardized = standardized.replace('<svg', '<svg viewBox="0 0 24 24"');
    }
    
    // Set fill to currentColor
    standardized = standardized.replace(/fill="[^"]*"/g, 'fill="currentColor"');
    if (!standardized.includes('fill=')) {
      standardized = standardized.replace('<svg', '<svg fill="currentColor"');
    }
  }
  
  // Ensure xmlns
  if (!standardized.includes('xmlns=')) {
    standardized = standardized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  
  // Clean up any extra whitespace
  standardized = standardized.replace(/\s+/g, ' ').trim();
  
  return standardized;
}

// Function to extract icon from a single page
async function extractIcon(page, icon) {
  try {
    console.log(`Processing ${icon.name}...`);
    await page.goto(icon.url, { waitUntil: 'networkidle' });
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Try to find the product icon in the sidebar
    const productSelector = `a[href="/${icon.name}/"] svg`;
    let svgElement = await page.$(productSelector);
    
    // If not found, try alternate URL patterns
    if (!svgElement) {
      const alternateSelectors = [
        `a[href*="/${icon.name}"] svg`, // Contains the product name
        `.sidebar a svg[data-icon="${icon.name}"]`, // Data attribute
        `.sidebar svg[data-icon="${icon.name}"]`, // Direct SVG with data attribute
      ];
      
      for (const selector of alternateSelectors) {
        svgElement = await page.$(selector);
        if (svgElement) break;
      }
    }
    
    if (!svgElement) {
      console.error(`Could not find icon for ${icon.name}`);
      return { name: icon.name, success: false, error: 'Icon not found' };
    }
    
    // Extract the SVG content
    const svgContent = await svgElement.evaluate(el => el.outerHTML);
    
    // Standardize the SVG
    const standardizedSVG = standardizeSVG(svgContent);
    
    // Save to file
    const iconPath = path.join(__dirname, '..', 'icons', icon.filename);
    fs.writeFileSync(iconPath, standardizedSVG);
    
    console.log(`✓ Successfully updated ${icon.name}`);
    return { name: icon.name, success: true };
    
  } catch (error) {
    console.error(`Error processing ${icon.name}:`, error.message);
    return { name: icon.name, success: false, error: error.message };
  }
}

// Main function with parallel execution
async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  
  // Process icons in parallel batches
  const batchSize = 5;
  for (let i = 0; i < icons.length; i += batchSize) {
    const batch = icons.slice(i, i + batchSize);
    const batchPromises = batch.map(async (icon) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const result = await extractIcon(page, icon);
      await context.close();
      return result;
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    console.log(`Completed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(icons.length / batchSize)}`);
  }
  
  await browser.close();
  
  // Summary report
  console.log('\n=== Verification Summary ===');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success);
  
  console.log(`Total icons: ${icons.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed icons:');
    failed.forEach(f => console.log(`- ${f.name}: ${f.error}`));
  }
  
  // Save results to file
  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'verification-results.json'),
    JSON.stringify(results, null, 2)
  );
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { extractIcon, standardizeSVG };