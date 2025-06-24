const mdIcons = require('./node_modules/.pnpm/react-icons@5.3.0_react@18.3.1/node_modules/react-icons/md');
const outlineIcons = Object.keys(mdIcons).filter(k => k.startsWith('MdOutline'));
console.log('Available MdOutline icons:', outlineIcons.slice(0, 20));
console.log('Total MdOutline icons:', outlineIcons.length); 
