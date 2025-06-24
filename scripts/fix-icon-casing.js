const fs = require('fs');
const path = require('path');

// Read the icon registry file
const iconRegistryPath = path.join(__dirname, '../libs/design-system/src/iconsV2/icon-registry.ts');
let content = fs.readFileSync(iconRegistryPath, 'utf8');

console.log('Fixing icon casing issues...');

// Fix the systematic casing issue: MdOutline -> MdOutline
const originalContent = content;
content = content.replace(/MdOutline/g, 'MdOutline');

// Count the changes
const changes = (content.match(/MdOutline/g) || []).length;
const originalCount = (originalContent.match(/MdOutline/g) || []).length;

console.log(`Fixed ${originalCount} MdOutline -> MdOutline replacements`);

// Write the fixed content back
fs.writeFileSync(iconRegistryPath, content, 'utf8');

console.log('Icon registry file updated successfully!');

// Also check for any remaining issues
const remainingIssues = content.match(/MdOutline/g);
if (remainingIssues) {
  console.log(`Warning: ${remainingIssues.length} MdOutline references still found`);
} else {
  console.log('All MdOutline references have been fixed!');
} 
