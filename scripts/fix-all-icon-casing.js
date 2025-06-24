const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  '../libs/design-system/src/iconsV2/icon-registry.ts',
  '../libs/design-system/src/iconsV2/react-icons-md.d.ts',
  '../libs/novui/src/icons/icon-registry.ts',
  '../libs/novui/src/icons/react-icons-md.d.ts'
];

console.log('Fixing icon casing issues in all files...');

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // First, fix the double 'd' issue: MdOutline -> MdOutline
    content = content.replace(/MdOutline/g, 'MdOutline');
    
    // Now fix the systematic casing issue: MdOutline -> MdOutline (but only if not already MdOutline)
    content = content.replace(/MdOutline(?!d)/g, 'MdOutline');
    
    // Count the changes
    const outlinedCount = (content.match(/MdOutline/g) || []).length;
    const outlineCount = (content.match(/MdOutline/g) || []).length;
    
    console.log(`  - Found ${outlinedCount} MdOutline references`);
    console.log(`  - Found ${outlineCount} remaining MdOutline references`);
    
    // Write the fixed content back
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`  - File updated successfully!`);
  } else {
    console.log(`  - File not found: ${filePath}`);
  }
});

console.log('\nAll files processed!'); 
