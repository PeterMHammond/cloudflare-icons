const fs = require('fs').promises;
const path = require('path');

async function compareAndUpdateIcons() {
  // Load official icons
  const officialIconsPath = path.join(__dirname, '..', 'official-icons.json');
  const officialIcons = JSON.parse(await fs.readFile(officialIconsPath, 'utf8'));
  
  // Read current icons.rs file
  const iconsRsPath = path.join(__dirname, '..', 'src', 'icons.rs');
  const iconsRsContent = await fs.readFile(iconsRsPath, 'utf8');
  
  // Parse viewBox sizes from our icons
  const ourIcons = {};
  
  // Split by icon entries
  const iconEntries = iconsRsContent.split('icons.insert(');
  
  iconEntries.forEach(entry => {
    if (!entry.trim()) return;
    
    // Extract name
    const nameMatch = entry.match(/^"([^"]+)"/);
    if (!nameMatch) return;
    const name = nameMatch[1];
    
    // Extract SVG - need to handle multiline
    const svgMatch = entry.match(/svg:\s*r##"([\s\S]*?)"##/);
    if (!svgMatch) return;
    const svg = svgMatch[1];
    
    // Extract viewBox
    const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
    if (viewBoxMatch) {
      ourIcons[name] = {
        viewBox: viewBoxMatch[1],
        svg: svg
      };
    }
  });
  
  console.log(`Found ${Object.keys(ourIcons).length} icons in our codebase`);
  
  console.log('\n🔍 Comparing Icons...\n');
  
  const updates = [];
  const viewBoxMismatches = [];
  
  for (const [officialName, officialData] of Object.entries(officialIcons)) {
    const ourName = officialName;
    
    if (ourIcons[ourName]) {
      const ourViewBox = ourIcons[ourName].viewBox;
      const officialViewBox = officialData.viewBox;
      
      if (ourViewBox !== officialViewBox) {
        viewBoxMismatches.push({
          name: officialName,
          ourViewBox,
          officialViewBox,
          svg: officialData.svg
        });
        
        console.log(`❌ ${officialName}:`);
        console.log(`   Our viewBox: ${ourViewBox}`);
        console.log(`   Official: ${officialViewBox}`);
        
        // Extract the actual SVG content from the official icon
        const svgMatch = officialData.svg.match(/<symbol[^>]*>(.+?)<\/symbol>/);
        if (svgMatch) {
          const pathContent = svgMatch[1];
          console.log(`   Needs update with official SVG paths`);
          
          updates.push({
            name: officialName,
            officialViewBox,
            pathContent
          });
        }
      } else {
        console.log(`✅ ${officialName}: viewBox matches (${ourViewBox})`);
      }
    } else {
      console.log(`⚠️  ${officialName}: Not found in our icons`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total official icons: ${Object.keys(officialIcons).length}`);
  console.log(`   ViewBox mismatches: ${viewBoxMismatches.length}`);
  console.log(`   Need updates: ${updates.length}`);
  
  // Save comparison report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalOfficial: Object.keys(officialIcons).length,
      viewBoxMismatches: viewBoxMismatches.length,
      needUpdates: updates.length
    },
    mismatches: viewBoxMismatches,
    updates: updates
  };
  
  await fs.writeFile(
    path.join(__dirname, '..', 'icon-comparison-results.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 Detailed report saved to: icon-comparison-results.json');
  
  // List icons that need special attention
  if (viewBoxMismatches.length > 0) {
    console.log('\n🚨 Icons needing immediate attention:');
    viewBoxMismatches.forEach(mismatch => {
      console.log(`   - ${mismatch.name}: ${mismatch.ourViewBox} → ${mismatch.officialViewBox}`);
    });
  }
}

compareAndUpdateIcons().catch(console.error);