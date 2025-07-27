#!/usr/bin/env node

// Script to extract Cloudflare icons from NPM packages
// Run: node extract-icons.js

const fs = require('fs');
const path = require('path');

// You would need to npm install these packages first:
// npm install @cloudflare/component-icon simple-icons

try {
  // Try to extract from @cloudflare/component-icon
  const cfIconsPath = path.join(__dirname, 'node_modules/@cloudflare/component-icon/es/icons');
  if (fs.existsSync(cfIconsPath)) {
    console.log('Found @cloudflare/component-icon');
    const icons = fs.readdirSync(cfIconsPath);
    
    const iconMap = {};
    icons.forEach(file => {
      if (file.endsWith('.js')) {
        const iconName = file.replace('.js', '');
        const content = fs.readFileSync(path.join(cfIconsPath, file), 'utf8');
        // Extract SVG from the JS module
        const svgMatch = content.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
        if (svgMatch) {
          iconMap[iconName] = svgMatch[0];
        }
      }
    });
    
    generateRustCode(iconMap);
  } else {
    console.log('@cloudflare/component-icon not found, trying simple-icons...');
    
    // Try simple-icons as fallback
    const simpleIconsPath = path.join(__dirname, 'node_modules/simple-icons/icons');
    if (fs.existsSync(simpleIconsPath)) {
      const cloudflareIcon = path.join(simpleIconsPath, 'cloudflare.svg');
      if (fs.existsSync(cloudflareIcon)) {
        const svg = fs.readFileSync(cloudflareIcon, 'utf8');
        generateRustCode({ cloudflare: svg });
      }
    }
  }
} catch (error) {
  console.error('Error extracting icons:', error);
  console.log('Please run: npm install @cloudflare/component-icon simple-icons');
}

function generateRustCode(iconMap) {
  let rustCode = `// Auto-generated Cloudflare icons
use std::collections::HashMap;

pub fn list_icons() -> Vec<&'static str> {
    vec![
${Object.keys(iconMap).map(name => `        "${name}",`).join('\n')}
    ]
}

pub fn get_icon_svg(name: &str) -> Option<String> {
    let icons = get_icons_map();
    icons.get(name).map(|s| s.to_string())
}

fn get_icons_map() -> HashMap<&'static str, &'static str> {
    let mut icons = HashMap::new();
    
`;

  Object.entries(iconMap).forEach(([name, svg]) => {
    // Escape the SVG for Rust string literal
    const escaped = svg.replace(/"/g, '\\"').replace(/\n/g, '');
    rustCode += `    icons.insert("${name}", r#"${escaped}"#);\n`;
  });

  rustCode += `    
    icons
}`;

  fs.writeFileSync(path.join(__dirname, 'src/icons_generated.rs'), rustCode);
  console.log(`Generated ${Object.keys(iconMap).length} icons in src/icons_generated.rs`);
}