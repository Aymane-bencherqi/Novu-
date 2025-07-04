const fs = require('fs');

function fixIconName(malformedName) {
  const suffix = malformedName.replace('MdOutline', '');
  const patterns = {
    'angerous': 'Dangerous',
    'ashboard': 'Dashboard',
    'ashboardCustomize': 'DashboardCustomize',
    'ataArray': 'DataArray',
    'ataExploration': 'DataExploration',
    'ataObject': 'DataObject',
    'ataSaverOff': 'DataSaverOff',
    'ataSaverOn': 'DataSaverOn',
    'ataThresholding': 'DataThresholding',
    'ataUsage': 'DataUsage',
    'ataset': 'Dataset',
    'atasetLinked': 'DatasetLinked',
    'ateRange': 'DateRange',
    'eblur': 'Deblur',
    'eck': 'Deck',
    'ehaze': 'Dehaze',
    'elete': 'Delete',
    'eleteForever': 'DeleteForever',
    'eleteSweep': 'DeleteSweep',
    'eliveryDining': 'DeliveryDining',
    'ensityLarge': 'DensityLarge',
    'ensityMedium': 'DensityMedium',
    'ensitySmall': 'DensitySmall',
    'epartureBoard': 'DepartureBoard',
    'escription': 'Description',
    'eselect': 'Deselect',
    'esignServices': 'DesignServices',
    'esk': 'Desk',
    'esktopAccessDisabled': 'DesktopAccessDisabled',
    'esktopMac': 'DesktopMac',
    'esktopWindows': 'DesktopWindows',
    'etails': 'Details',
    'eveloperBoard': 'DeveloperBoard',
    'eveloperBoardOff': 'DeveloperBoardOff',
    'eveloperMode': 'DeveloperMode',
    'eviceHub': 'DeviceHub',
    'eviceThermostat': 'DeviceThermostat',
    'eviceUnknown': 'DeviceUnknown',
    'evices': 'Devices',
    'evicesFold': 'DevicesFold',
    'evicesOther': 'DevicesOther',
    'ialerSip': 'DialerSip',
    'ialpad': 'Dialpad',
    'iamond': 'Diamond',
    'ifference': 'Difference',
    'ining': 'Dining',
    'innerDining': 'DinnerDining',
    'irections': 'Directions',
    'irectionsBike': 'DirectionsBike',
    'irectionsBoat': 'DirectionsBoat',
    'irectionsBoatFilled': 'DirectionsBoatFilled',
    'irectionsBus': 'DirectionsBus',
    'irectionsBusFilled': 'DirectionsBusFilled',
    'irectionsCar': 'DirectionsCar',
    'irectionsCarFilled': 'DirectionsCarFilled',
    'irectionsOff': 'DirectionsOff',
    'irectionsRailway': 'DirectionsRailway',
    'irectionsRailwayFilled': 'DirectionsRailwayFilled',
    'irectionsRun': 'DirectionsRun',
    'irectionsSubway': 'DirectionsSubway',
    'irectionsSubwayFilled': 'DirectionsSubwayFilled',
    'irectionsTransit': 'DirectionsTransit',
    'irectionsTransitFilled': 'DirectionsTransitFilled',
    'irectionsWalk': 'DirectionsWalk',
    'irtyLens': 'DirtyLens',
    'isabledByDefault': 'DisabledByDefault',
    'isabledVisible': 'DisabledVisible',
    'iscFull': 'DiscFull',
    'iscount': 'Discount',
    'isplaySettings': 'DisplaySettings',
    'iversity1': 'Diversity1',
    'iversity2': 'Diversity2',
    'iversity3': 'Diversity3',
    'ns': 'Dns',
    'oDisturb': 'DoDisturb',
    'oDisturbAlt': 'DoDisturbAlt',
    'oDisturbOff': 'DoDisturbOff',
    'oDisturbOn': 'DoDisturbOn',
    'oNotDisturb': 'DoNotDisturb',
    'oNotDisturbAlt': 'DoNotDisturbAlt',
    'oNotDisturbOff': 'DoNotDisturbOff',
    'oNotDisturbOn': 'DoNotDisturbOn',
    'oNotDisturbOnTotalSilence': 'DoNotDisturbOnTotalSilence',
    'oNotStep': 'DoNotStep',
    'oNotTouch': 'DoNotTouch',
    'ock': 'Dock',
    'ocumentScanner': 'DocumentScanner',
    'omain': 'Domain',
    'omainAdd': 'DomainAdd',
    'omainDisabled': 'DomainDisabled',
    'omainVerification': 'DomainVerification',
    'one': 'Done',
    'oneAll': 'DoneAll',
    'oneOutline': 'DoneOutline',
    'onutLarge': 'DonutLarge',
    'onutSmall': 'DonutSmall',
    'oorBack': 'DoorBack',
    'oorFront': 'DoorFront',
    'oorSliding': 'DoorSliding',
    'oorbell': 'Doorbell',
    'ownload': 'Download',
    'ownloadDone': 'DownloadDone',
    'ownloadForOffline': 'DownloadForOffline',
    'ownloading': 'Downloading',
    'rafts': 'Drafts',
    'ragIndicator': 'DragIndicator',
    'raw': 'Draw',
    'riveEta': 'DriveEta',
    'riveFileMove': 'DriveFileMove',
    'riveFileMoveOutline': 'DriveFileMoveOutline',
    'riveFileRenameOutline': 'DriveFileRenameOutline',
    'riveFolderUpload': 'DriveFolderUpload',
    'ry': 'Dry',
    'ryCleaning': 'DryCleaning',
    'uplicate': 'Duplicate',
    'vr': 'Dvr',
    'ynamicFeed': 'DynamicFeed',
    'ynamicForm': 'DynamicForm',
    'arkMode': 'DarkMode',
    'ry': 'Try',
    'ryCleaning': 'DryCleaning',
    'ynamicForm': 'DynamicForm'
  };
  if (patterns[suffix]) {
    return `MdOutline${patterns[suffix]}`;
  }
  if (suffix.length > 0) {
    return `MdOutline${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`;
  }
  return malformedName;
}

function fixFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return 0;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let totalReplacements = 0;
  const malformedPattern = /MdOutline[a-z][A-Z][a-zA-Z]*/g;
  const matches = content.match(malformedPattern);
  if (matches) {
    const uniqueMatches = [...new Set(matches)];
    uniqueMatches.forEach(malformedName => {
      const fixedName = fixIconName(malformedName);
      if (fixedName !== malformedName) {
        const regex = new RegExp(malformedName, 'g');
        const count = (content.match(regex) || []).length;
        content = content.replace(regex, fixedName);
        totalReplacements += count;
        console.log(`Fixed ${count} occurrence(s) of ${malformedName} -> ${fixedName}`);
      }
    });
  }
  if (totalReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\nTotal replacements made in ${filePath}: ${totalReplacements}`);
  } else {
    console.log(`No malformed icon names found in ${filePath}`);
  }
  return totalReplacements;
}

const filesToFix = [
  'libs/novui/src/icons/icon-registry.ts',
  'libs/design-system/src/iconsV2/icon-registry.ts'
];

let totalFilesFixed = 0;
let totalReplacements = 0;

filesToFix.forEach(filePath => {
  const replacements = fixFile(filePath);
  if (replacements > 0) {
    totalFilesFixed++;
    totalReplacements += replacements;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Files processed: ${filesToFix.length}`);
console.log(`Files with fixes: ${totalFilesFixed}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log(`\nIcon name fixes completed!`);
