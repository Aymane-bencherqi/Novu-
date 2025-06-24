const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'libs/novui/src/icons/icon-registry.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix malformed MdOutline names
const replacements = [
  ['MdOutlineangerous', 'MdOutlineDangerous'],
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
  ['MdOutlineTryCleaning', 'MdOutlineDryCleaning'],
];

replacements.forEach(([oldName, newName]) => {
  content = content.replace(new RegExp(oldName, 'g'), newName);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed malformed MdOutline icon names in icon-registry.ts'); 
