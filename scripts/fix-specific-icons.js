const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  '../libs/design-system/src/iconsV2/icon-registry.ts',
  '../libs/design-system/src/iconsV2/react-icons-md.d.ts',
  '../libs/novui/src/icons/icon-registry.ts',
  '../libs/novui/src/icons/react-icons-md.d.ts'
];

// Specific icon mappings to fix
const iconMappings = {
  'MdOutlineScience': 'MdScience',
  'MdOutlineScoreboard': 'MdScoreboard',
  'MdOutlineScubaDiving': 'MdScubaDiving',
  'MdOutlineSelfImprovement': 'MdSelfImprovement',
  'MdOutlineSentimentDissatisfied': 'MdSentimentDissatisfied',
  'MdOutlineSentimentNeutral': 'MdSentimentNeutral',
  'MdOutlineSentimentSatisfied': 'MdSentimentSatisfied',
  'MdOutlineSentimentVeryDissatisfied': 'MdSentimentVeryDissatisfied',
  'MdOutlineSentimentVerySatisfied': 'MdSentimentVerySatisfied',
  'MdOutlineSevereCold': 'MdSevereCold',
  'MdOutlineShare': 'MdShare',
  'MdOutlineSick': 'MdSick',
  'MdOutlineSignLanguage': 'MdSignLanguage',
  'MdOutlineSingleBed': 'MdSingleBed',
  'MdOutlineSkateboarding': 'MdSkateboarding',
  'MdOutlineSledding': 'MdSledding',
  'MdOutlineSnowboarding': 'MdSnowboarding',
  'MdOutlineSnowshoeing': 'MdSnowshoeing',
  'MdOutlineSocialDistance': 'MdSocialDistance',
  'MdOutlineSouthAmerica': 'MdSouthAmerica',
  'MdOutlineSportsBaseball': 'MdSportsBaseball',
  'MdOutlineSportsBasketball': 'MdSportsBasketball',
  'MdOutlineSportsCricket': 'MdSportsCricket',
  'MdOutlineSportsEsports': 'MdSportsEsports',
  'MdOutlineSportsFootball': 'MdSportsFootball',
  'MdOutlineSportsGolf': 'MdSportsGolf',
  'MdOutlineSportsGymnastics': 'MdSportsGymnastics',
  'MdOutlineSportsHandball': 'MdSportsHandball',
  'MdOutlineSportsHockey': 'MdSportsHockey',
  'MdOutlineSportsKabaddi': 'MdSportsKabaddi',
  'MdOutlineSportsMartialArts': 'MdSportsMartialArts',
  'MdOutlineSportsMma': 'MdSportsMma',
  'MdOutlineSportsMotorsports': 'MdSportsMotorsports',
  'MdOutlineSportsRugby': 'MdSportsRugby',
  'MdOutlineSportsSoccer': 'MdSportsSoccer',
  'MdOutlineSportsTennis': 'MdSportsTennis',
  'MdOutlineSportsVolleyball': 'MdSportsVolleyball',
  'MdOutlineSports': 'MdSports',
  'MdOutlineSurfing': 'MdSurfing',
  'MdOutlineSwitchAccount': 'MdSwitchAccount',
  'MdOutlineThumbDownAlt': 'MdThumbDownAlt',
  'MdOutlineThumbUpAlt': 'MdThumbUpAlt',
  'MdOutlineThunderstorm': 'MdThunderstorm',
  'MdOutlineTornado': 'MdTornado',
  'MdOutlineTransgender': 'MdTransgender',
  'MdOutlineTravelExplore': 'MdTravelExplore',
  'MdOutlineTsunami': 'MdTsunami',
  'MdOutlineVaccines': 'MdVaccines',
  'MdOutlineVolcano': 'MdVolcano',
  'MdOutlineWallet': 'MdWallet',
  'MdOutlineWaterDrop': 'MdWaterDrop',
  'MdOutlineWavingHand': 'MdWavingHand',
  'MdOutlineWhatsapp': 'MdWhatsapp',
  'MdOutlineWhatshot': 'MdWhatshot',
  'MdOutlineWoman2': 'MdWoman2',
  'MdOutlineWoman': 'MdWoman',
  'MdOutlineWorkspacePremium': 'MdWorkspacePremium',
  'MdOutlineCheckBoxOutlineBlank': 'MdCheckBoxOutlineBlank',
  'MdOutlineCheckBox': 'MdCheckBox',
  'MdOutlineIndeterminateCheckBox': 'MdIndeterminateCheckBox',
  'MdOutlineRadioButtonChecked': 'MdRadioButtonChecked',
  'MdOutlineRadioButtonUnchecked': 'MdRadioButtonUnchecked',
  'MdOutlineStarBorderPurple500': 'MdStarBorderPurple500',
  'MdOutlineStarBorder': 'MdStarBorder',
  'MdOutlineStarHalf': 'MdStarHalf',
  'MdOutlineStarOutline': 'MdStarOutline',
  'MdOutlineStarPurple500': 'MdStarPurple500',
  'MdOutlineStar': 'MdStar',
  'MdOutlineToggleOff': 'MdToggleOff',
  'MdOutlineeleteOutline': 'MdDeleteOutline'
};

console.log('Fixing specific problematic icons...');

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = 0;
    
    // Apply each icon mapping
    Object.entries(iconMappings).forEach(([oldName, newName]) => {
      const regex = new RegExp(oldName, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newName);
        changesMade += matches.length;
        console.log(`  - Replaced ${matches.length} instances of ${oldName} -> ${newName}`);
      }
    });
    
    if (changesMade > 0) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`  - Total changes: ${changesMade}`);
    } else {
      console.log(`  - No changes needed`);
    }
  } else {
    console.log(`  - File not found: ${filePath}`);
  }
});

console.log('\nSpecific icon fixes completed!'); 
