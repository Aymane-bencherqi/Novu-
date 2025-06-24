const fs = require('fs');
const path = require('path');

// Read the icon registry file
const iconRegistryPath = path.join(__dirname, '../libs/design-system/src/iconsV2/icon-registry.ts');
const content = fs.readFileSync(iconRegistryPath, 'utf8');

// Extract all import statements
const importRegex = /import\s*{([^}]+)}\s*from\s*['"]react-icons\/md['"];?/g;
const imports = [];
let match;

while ((match = importRegex.exec(content)) !== null) {
  const importContent = match[1];
  const iconImports = importContent.split(',').map(imp => imp.trim());
  
  for (const iconImport of iconImports) {
    if (iconImport.includes(' as ')) {
      const [originalName] = iconImport.split(' as ');
      imports.push(originalName.trim());
    } else {
      imports.push(iconImport.trim());
    }
  }
}

// Check for common casing issues
const problematicIcons = [];
for (const icon of imports) {
  // Check for common patterns that might be wrong
  if (icon.includes('3D') && !icon.includes('3d')) {
    problematicIcons.push(`${icon} -> ${icon.replace('3D', '3d')}`);
  }
  if (icon.includes('Outline') && !icon.includes('Outlined')) {
    problematicIcons.push(`${icon} -> ${icon.replace('Outline', 'Outlined')}`);
  }
}

console.log('Problematic icons found:');
problematicIcons.forEach(icon => console.log(icon));

// Also check for icons that might not exist
console.log('\nChecking for potentially non-existent icons...');
const testIcons = [
  'Md3DRotation',
  'Md3dRotation', 
  'MdOutlineSurroundSound',
  'MdOutlineSurroundSound'
];

console.log('Test icons to verify:');
testIcons.forEach(icon => console.log(`- ${icon}`)); 
