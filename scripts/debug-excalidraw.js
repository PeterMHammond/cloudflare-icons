const fs = require('fs');
const path = require('path');

async function debugExcalidraw() {
  // Fetch from the local server
  const response = await fetch('http://localhost:8787/api/excalidraw-backup');
  const data = await response.json();
  
  console.log('Excalidraw data structure:');
  console.log('Total elements:', data.elements.length);
  console.log('Total files:', Object.keys(data.files).length);
  
  // Find all text elements
  const textElements = data.elements.filter(el => el.type === 'text');
  const imageElements = data.elements.filter(el => el.type === 'image');
  
  console.log('\nText elements:', textElements.length);
  console.log('Image elements:', imageElements.length);
  
  // Check first few text elements
  console.log('\nFirst 5 text elements:');
  textElements.slice(0, 5).forEach(text => {
    console.log(`- ID: ${text.id}`);
    console.log(`  Text: ${text.text}`);
    console.log(`  Position: x=${text.x}, y=${text.y}`);
    console.log(`  Size: width=${text.width}, height=${text.height}`);
    console.log(`  Font: size=${text.fontSize}, family=${text.fontFamily}`);
    console.log(`  Alignment: textAlign=${text.textAlign}, verticalAlign=${text.verticalAlign}`);
  });
  
  // Check specific cases
  console.log('\nChecking specific cases:');
  
  // Find durable-objects
  const durableObjectsText = textElements.find(t => t.text && t.text.toLowerCase().includes('durable'));
  if (durableObjectsText) {
    console.log('\nDurable Objects text element:');
    console.log(JSON.stringify(durableObjectsText, null, 2));
  }
  
  // Check text-icon pairing
  console.log('\nChecking text-icon pairing:');
  const pairedElements = [];
  
  imageElements.forEach(img => {
    const imgName = img.id; // e.g., "analytics-engine"
    const textElement = textElements.find(t => t.id === imgName);
    if (textElement) {
      pairedElements.push({
        name: imgName,
        icon: { id: img.id, x: img.x, y: img.y, width: img.width },
        text: { id: textElement.id, x: textElement.x, y: textElement.y, width: textElement.width, text: textElement.text }
      });
    }
  });
  
  console.log(`Found ${pairedElements.length} paired icon-text elements`);
  console.log('\nFirst 3 pairs:');
  pairedElements.slice(0, 3).forEach(pair => {
    console.log(`\n${pair.name}:`);
    console.log(`  Icon: x=${pair.icon.x}, width=${pair.icon.width}`);
    console.log(`  Text: x=${pair.text.x}, width=${pair.text.width}, text="${pair.text.text}"`);
    console.log(`  Alignment check: x-match=${pair.icon.x === pair.text.x}, width-match=${pair.icon.width === pair.text.width}`);
  });
  
  // Save for inspection
  fs.writeFileSync(
    path.join(__dirname, '..', 'debug-excalidraw.json'),
    JSON.stringify(data, null, 2)
  );
  console.log('\nFull data saved to debug-excalidraw.json');
}

debugExcalidraw().catch(console.error);