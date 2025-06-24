const mdIcons = require('./node_modules/.pnpm/react-icons@5.3.0_react@18.3.1/node_modules/react-icons/md');
const cleaningIcons = Object.keys(mdIcons).filter(k => k.includes('Cleaning') || k.includes('Dry'));
console.log('Cleaning-related icons:', cleaningIcons); 
