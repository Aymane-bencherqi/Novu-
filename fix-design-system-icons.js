const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'libs/design-system/src/iconsV2/icon-registry.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Comprehensive list of malformed MdOutline names and their correct versions
const replacements = [
  ['MdOutlineDangerous', 'MdOutlineDangerous'],
  ['MdOutlineashboardCustomize', 'MdOutlineDashboardCustomize'],
  ['MdOutlineashboard', 'MdOutlineDashboard'],
  ['MdOutlineataExploration', 'MdOutlineDataExploration'],
  ['MdOutlineataThresholding', 'MdOutlineDataThresholding'],
  ['MdOutlineateRange', 'MdOutlineDateRange'],
  ['MdOutlineeleteForever', 'MdOutlineDeleteForever'],
  ['MdOutlineelete', 'MdOutlineDelete'],
  ['MdOutlineensityLarge', 'MdOutlineDensityLarge'],
  ['MdOutlineensityMedium', 'MdOutlineDensityMedium'],
  ['MdOutlineensitySmall', 'MdOutlineDensitySmall'],
  ['MdOutlineescription', 'MdOutlineDescription'],
  ['MdOutlineisabledByDefault', 'MdOutlineDisabledByDefault'],
  ['MdOutlineisabledVisible', 'MdOutlineDisabledVisible'],
  ['MdOutlineisplaySettings', 'MdOutlineDisplaySettings'],
  ['MdOutlinens', 'MdOutlineDns'],
  ['MdOutlineoneAll', 'MdOutlineDoneAll'],
  ['MdOutlineoneOutline', 'MdOutlineDoneOutline'],
  ['MdOutlineone', 'MdOutlineDone'],
  ['MdOutlineonutLarge', 'MdOutlineDonutLarge'],
  ['MdOutlineonutSmall', 'MdOutlineDonutSmall'],
  ['MdOutlineragIndicator', 'MdOutlineDragIndicator'],
  ['MdOutlineynamicForm', 'MdOutlineDynamicForm'],
  ['MdOutlineining', 'MdOutlineDining'],
  ['MdOutlineoorBack', 'MdOutlineDoorBack'],
  ['MdOutlineoorFront', 'MdOutlineDoorFront'],
  ['MdOutlineoorSliding', 'MdOutlineDoorSliding'],
  ['MdOutlineoorbell', 'MdOutlineDoorbell'],
  ['MdOutlineeck', 'MdOutlineDeck'],
  ['MdOutlineiversity1', 'MdOutlineDiversity1'],
  ['MdOutlineiversity2', 'MdOutlineDiversity2'],
  ['MdOutlineiversity3', 'MdOutlineDiversity3'],
  ['MdOutlineomainAdd', 'MdOutlineDomainAdd'],
  ['MdOutlineomain', 'MdOutlineDomain'],
  ['MdOutlineownhillSkiing', 'MdOutlineDownhillSkiing'],
  ['MdOutlineTryCleaning', 'MdOutlineDryCleaning'],
  ['MdOutlinery', 'MdOutlineTry'],
  ['MdOutlineining', 'MdOutlineDining'],
  ['MdOutlineoorBack', 'MdOutlineDoorBack'],
  ['MdOutlineoorFront', 'MdOutlineDoorFront'],
  ['MdOutlineoorSliding', 'MdOutlineDoorSliding'],
  ['MdOutlineoorbell', 'MdOutlineDoorbell'],
  ['MdOutlineeck', 'MdOutlineDeck'],
  ['MdOutlineiversity1', 'MdOutlineDiversity1'],
  ['MdOutlineiversity2', 'MdOutlineDiversity2'],
  ['MdOutlineiversity3', 'MdOutlineDiversity3'],
  ['MdOutlineomainAdd', 'MdOutlineDomainAdd'],
  ['MdOutlineomain', 'MdOutlineDomain'],
  ['MdOutlineownhillSkiing', 'MdOutlineDownhillSkiing'],
  ['MdOutlineryCleaning', 'MdOutlineDryCleaning'],
];

let totalReplacements = 0;

replacements.forEach(([oldName, newName]) => {
  const regex = new RegExp(oldName, 'g');
  const matches = content.match(regex);
  if (matches) {
    content = content.replace(regex, newName);
    totalReplacements += matches.length;
    console.log(`Fixed ${matches.length} occurrence(s) of ${oldName} -> ${newName}`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nTotal replacements made: ${totalReplacements}`);
console.log('Fixed malformed MdOutline icon names in design-system icon-registry.ts'); 
