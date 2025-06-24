const fs = require('fs');
const path = require('path');

// Read the icon registry file
const iconRegistryPath = path.join(__dirname, '../libs/design-system/src/iconsV2/icon-registry.ts');
let content = fs.readFileSync(iconRegistryPath, 'utf8');

console.log('Fixing icon casing issues with more precision...');

// First, fix the double 'd' issue: MdOutline -> MdOutline
content = content.replace(/MdOutline/g, 'MdOutline');

// Now fix the systematic casing issue: MdOutline -> MdOutline (but only if not already MdOutline)
content = content.replace(/MdOutline(?!d)/g, 'MdOutline');

// Count the changes
const outlinedCount = (content.match(/MdOutline/g) || []).length;
const outlineCount = (content.match(/MdOutline/g) || []).length;

console.log(`Found ${outlinedCount} MdOutline references`);
console.log(`Found ${outlineCount} remaining MdOutline references`);

// Write the fixed content back
fs.writeFileSync(iconRegistryPath, content, 'utf8');

console.log('Icon registry file updated successfully!');

// Check for any remaining issues
if (outlineCount > 0) {
  console.log(`Warning: ${outlineCount} MdOutline references still found`);
} else {
  console.log('All MdOutline references have been fixed!');
}

// Also check for any double 'd' issues
const doubleDCount = (content.match(/MdOutline/g) || []).length;
if (doubleDCount > 0) {
  console.log(`Warning: ${doubleDCount} MdOutline references still found`);
} else {
  console.log('All double d issues have been fixed!');
} 
