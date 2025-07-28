const fs = require('fs').promises;
const path = require('path');

async function debugIconNames() {
  const iconsRsPath = path.join(__dirname, '..', 'src', 'icons.rs');
  const iconsRsContent = await fs.readFile(iconsRsPath, 'utf8');
  
  // Try different patterns
  const patterns = [
    /icons\.insert\("([^"]+)"/g,
    /icons\.insert\("([^"]+)",\s*IconData\s*{[^}]*svg:\s*r##"([^"]+)"##/gs
  ];
  
  console.log('Testing patterns...\n');
  
  patterns.forEach((pattern, index) => {
    console.log(`Pattern ${index + 1}:`);
    const matches = [...iconsRsContent.matchAll(pattern)];
    console.log(`Found ${matches.length} matches`);
    
    if (matches.length > 0) {
      console.log('First 5 matches:');
      matches.slice(0, 5).forEach(match => {
        console.log(`  - Icon name: "${match[1]}"`);
        if (match[2]) {
          const viewBoxMatch = match[2].match(/viewBox="([^"]+)"/);
          if (viewBoxMatch) {
            console.log(`    ViewBox: ${viewBoxMatch[1]}`);
          }
        }
      });
    }
    console.log();
  });
  
  // Also check the actual structure
  console.log('Sample of icons.rs content:');
  const lines = iconsRsContent.split('\n');
  const insertLines = lines.filter(line => line.includes('icons.insert'));
  console.log(`Found ${insertLines.length} insert lines`);
  console.log('First 3:');
  insertLines.slice(0, 3).forEach(line => {
    console.log(`  ${line.trim()}`);
  });
}

debugIconNames().catch(console.error);