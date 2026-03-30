export const survivalGuides = {
  en: {
    firstAid: {
      id: 'first-aid',
      title: 'First Aid',
      icon: 'Heart',
      color: '#FF3B30',
      guides: [
        {
          id: 'cpr',
          title: 'CPR - Adult',
          priority: 'critical',
          steps: [
            'Check scene safety - ensure no danger to yourself',
            'Check responsiveness - tap shoulders, shout "Are you okay?"',
            'Call for help or have someone call emergency services',
            'Place victim on firm, flat surface',
            'Open airway - tilt head back, lift chin',
            'Check for breathing - look, listen, feel for 10 seconds',
            'Begin chest compressions - place heel of hand on center of chest',
            'Push hard and fast - 2 inches deep, 100-120 compressions/minute',
            'Give 2 rescue breaths after 30 compressions',
            'Continue cycle until help arrives or victim recovers'
          ]
        },
        {
          id: 'bleeding',
          title: 'Stop Severe Bleeding',
          priority: 'critical',
          steps: [
            'Apply direct pressure with clean cloth or bandage',
            'If available, use gloves or plastic bag to protect yourself',
            'Press firmly and continuously - do not lift to check',
            'If blood soaks through, add more material on top',
            'Elevate wounded limb above heart level if possible',
            'For limb wounds, consider tourniquet if bleeding won\'t stop',
            'Apply tourniquet 2-3 inches above wound, not on joint',
            'Tighten until bleeding stops - note the time',
            'Keep victim warm and calm',
            'Seek medical attention immediately'
          ]
        },
        {
          id: 'burns',
          title: 'Treating Burns',
          priority: 'high',
          steps: [
            'Remove victim from heat source safely',
            'Cool burn with cool (not cold) running water for 10-20 minutes',
            'Remove jewelry and loose clothing near burn',
            'Do NOT apply ice, butter, or ointments',
            'Do NOT break blisters',
            'Cover with clean, dry bandage or cloth',
            'For chemical burns, flush with water for 20+ minutes',
            'For electrical burns, do not touch victim until power is off',
            'Watch for signs of shock',
            'Seek medical help for burns larger than your palm'
          ]
        },
        {
          id: 'choking',
          title: 'Choking - Heimlich Maneuver',
          priority: 'critical',
          steps: [
            'Ask "Are you choking?" - if they cannot speak, act immediately',
            'Stand behind the victim',
            'Make a fist with one hand',
            'Place fist thumb-side against abdomen, above navel',
            'Grasp fist with other hand',
            'Give quick, upward thrusts into abdomen',
            'Repeat until object is expelled or victim becomes unconscious',
            'If victim becomes unconscious, begin CPR',
            'Check mouth for visible objects before giving breaths',
            'Continue until help arrives'
          ]
        },
        {
          id: 'fractures',
          title: 'Fractures & Sprains',
          priority: 'medium',
          steps: [
            'Do not move victim unless absolutely necessary',
            'Immobilize the injured area',
            'Apply ice wrapped in cloth - 20 minutes on, 20 off',
            'Elevate injured limb if possible',
            'Create splint using rigid material (board, rolled newspaper)',
            'Pad splint for comfort',
            'Secure splint above and below injury',
            'Check circulation below injury (warmth, color, pulse)',
            'Watch for signs of shock',
            'Seek medical attention'
          ]
        }
      ]
    },
    findingWater: {
      id: 'finding-water',
      title: 'Finding Water',
      icon: 'Droplets',
      color: '#007AFF',
      guides: [
        {
          id: 'water-sources',
          title: 'Finding Water Sources',
          priority: 'critical',
          steps: [
            'Look for signs of water: green vegetation, animal tracks, insects',
            'Travel downhill - water flows to lowest points',
            'Listen for running water sounds',
            'Check valleys, canyon bottoms, and rock crevices',
            'Morning dew can be collected from plants with cloth',
            'Dig in dry riverbeds - water may be just below surface',
            'Follow animal trails - they often lead to water',
            'Birds flying in a straight line may indicate water direction',
            'Bees typically nest within 3 miles of water',
            'Avoid stagnant, foul-smelling, or discolored water'
          ]
        },
        {
          id: 'water-purification',
          title: 'Water Purification',
          priority: 'critical',
          steps: [
            'ALWAYS purify water from unknown sources',
            'Boiling: Bring to rolling boil for at least 1 minute (3 min at altitude)',
            'Let water cool before drinking',
            'Chemical treatment: Use purification tablets per instructions',
            'UV treatment: Use UV purifier if available',
            'Solar disinfection: Clear bottles in sun for 6+ hours',
            'Filter through cloth to remove large particles first',
            'Improvised filter: layers of sand, gravel, charcoal in container',
            'Collect rainwater directly - generally safe',
            'Distillation: Boil and collect condensation for purest water'
          ]
        },
        {
          id: 'water-storage',
          title: 'Water Storage & Rationing',
          priority: 'high',
          steps: [
            'Store purified water in clean, sealed containers',
            'Keep containers out of direct sunlight',
            'In survival situation: minimum 1 liter/day, ideally 3 liters',
            'Reduce water needs: stay in shade, limit activity during heat',
            'Do not ration water - drink when thirsty to avoid dehydration',
            'Signs of dehydration: dark urine, headache, dizziness',
            'Avoid alcohol, caffeine - they increase water loss',
            'Eat less if water is scarce - digestion uses water',
            'Breathe through nose to reduce moisture loss',
            'Create a solar still for emergency water collection'
          ]
        }
      ]
    },
    chemicalNuclear: {
      id: 'chemical-nuclear',
      title: 'Chemical/Nuclear',
      icon: 'AlertTriangle',
      color: '#FFCC00',
      guides: [
        {
          id: 'nuclear-attack',
          title: 'Nuclear Attack Response',
          priority: 'critical',
          steps: [
            'Get inside immediately - brick/concrete building is best',
            'If outside during blast: drop, cover face, do not look at flash',
            'Get to center of building, away from windows',
            'Go to basement if available',
            'Stay inside for at least 24 hours unless instructed otherwise',
            'Fallout is most dangerous in first few hours',
            'Seal windows and doors with wet towels',
            'Turn off ventilation systems',
            'Remove and bag contaminated clothing',
            'Shower thoroughly if exposed to fallout'
          ]
        },
        {
          id: 'radiation-protection',
          title: 'Radiation Protection',
          priority: 'critical',
          steps: [
            'Distance: Get as far from radiation source as possible',
            'Shielding: Dense materials (concrete, lead, earth) block radiation',
            'Time: Minimize time near contaminated areas',
            'Cover skin: Long sleeves, pants, hats, masks',
            'Avoid touching surfaces that may be contaminated',
            'Do not eat or drink anything that may be contaminated',
            'Sealed food and bottled water in buildings are usually safe',
            'If you must go outside, cover nose and mouth',
            'Brush off contamination before entering clean areas',
            'Monitor official channels for all-clear announcements'
          ]
        },
        {
          id: 'chemical-attack',
          title: 'Chemical Attack Response',
          priority: 'critical',
          steps: [
            'Get upwind and uphill from suspected source',
            'Cover mouth and nose with wet cloth',
            'Get inside and seal the building',
            'Close all windows, doors, and vents',
            'Turn off fans, AC, and heating systems',
            'Seal gaps with wet towels or plastic and tape',
            'Go to highest floor for heavy gases, lowest for light gases',
            'Remove and bag contaminated clothing',
            'Wash exposed skin thoroughly with soap and water',
            'Flush eyes with clean water if exposed'
          ]
        },
        {
          id: 'decontamination',
          title: 'Personal Decontamination',
          priority: 'high',
          steps: [
            'Move to clean area before decontaminating',
            'Remove outer clothing - cuts contamination by 90%',
            'Place clothing in plastic bag, seal it',
            'Do not touch face until hands are clean',
            'Shower with warm water and soap - do not scrub skin',
            'Shampoo hair thoroughly - do not use conditioner',
            'Wash from head to toe - let water run down and off',
            'Gently blow nose and wipe ears with wet cloth',
            'Put on clean clothes',
            'Seek medical attention if symptoms develop'
          ]
        }
      ]
    },
    sheltering: {
      id: 'sheltering',
      title: 'Shelter',
      icon: 'Home',
      color: '#8B5CF6',
      guides: [
        {
          id: 'emergency-shelter',
          title: 'Emergency Shelter Building',
          priority: 'high',
          steps: [
            'Find natural shelter first: caves, overhangs, dense trees',
            'Avoid flood zones, dead trees, and unstable ground',
            'Build shelter before dark - takes longer than expected',
            'Debris hut: Framework of branches, covered with leaves/debris',
            'Make shelter just big enough for body - easier to heat',
            'Insulate floor with dry leaves, grass, or pine needles',
            'Create windbreak on windy side',
            'Angle roof to shed rain and snow',
            'Build near resources: water, firewood, but not in animal paths',
            'Mark shelter location for rescue visibility'
          ]
        },
        {
          id: 'urban-shelter',
          title: 'Urban Shelter-in-Place',
          priority: 'high',
          steps: [
            'Choose interior room with fewest windows',
            'Basement is safest for most threats',
            'Stock room with supplies: water, food, radio, flashlight',
            'Seal windows and doors with plastic sheeting and tape',
            'Turn off HVAC systems during chemical/biological threats',
            'Have communication plan with family members',
            'Keep important documents in waterproof container',
            'Have multiple exit routes planned',
            'Keep emergency supplies accessible',
            'Monitor emergency broadcasts for instructions'
          ]
        },
        {
          id: 'cold-weather',
          title: 'Cold Weather Survival',
          priority: 'critical',
          steps: [
            'Stay dry - wet clothing loses insulation',
            'Layer clothing: base, insulation, outer shell',
            'Protect head, hands, and feet - most heat loss areas',
            'Build shelter to trap body heat',
            'Use natural materials for insulation',
            'Make a small fire for warmth - not inside enclosed shelter',
            'Eat high-calorie foods - body needs fuel to stay warm',
            'Stay hydrated - dehydration speeds hypothermia',
            'Watch for frostbite signs: numbness, white/gray skin',
            'Do not rub frostbitten areas - warm gradually with body heat'
          ]
        },
        {
          id: 'bunker-prep',
          title: 'Bunker/Safe Room Preparation',
          priority: 'medium',
          steps: [
            'Choose location: basement corner, interior room',
            'Reinforce walls if possible with sandbags or concrete',
            'Install heavy door that opens inward',
            'Ensure adequate ventilation or air filtration',
            'Stock supplies for minimum 2 weeks',
            'Include water: 1 gallon per person per day',
            'Store non-perishable food with long shelf life',
            'Keep first aid kit and medications',
            'Include communication devices: radio, charged phones',
            'Have sanitation supplies: bucket, bags, chemicals'
          ]
        }
      ]
    },
    foodForaging: {
      id: 'food-foraging',
      title: 'Food & Foraging',
      icon: 'Leaf',
      color: '#34C759',
      guides: [
        {
          id: 'foraging-basics',
          title: 'Foraging Safety',
          priority: 'high',
          steps: [
            'Only eat plants you can positively identify',
            'When in doubt, do NOT eat it',
            'Universal edibility test: Apply to skin, lips, tongue over hours',
            'Avoid plants with milky sap, bitter taste, or almond smell',
            'Avoid red plants, umbrella-shaped flowers, shiny leaves',
            'Cook when possible - removes many toxins',
            'Start with small amounts of new foods',
            'Keep some food for tomorrow - don\'t eat everything',
            'Learn local edible plants before emergency',
            'Insects are generally safe: grasshoppers, ants, grubs (cooked)'
          ]
        },
        {
          id: 'food-storage',
          title: 'Emergency Food Storage',
          priority: 'high',
          steps: [
            'Store food in cool, dry, dark place',
            'Rotate stock - use oldest first (FIFO)',
            'Include variety: grains, proteins, fruits, vegetables',
            'Choose foods with long shelf life: rice, beans, canned goods',
            'Include comfort foods for morale',
            'Store food in airtight containers',
            'Protect from rodents and insects',
            'Keep food away from chemicals and fuels',
            'Include manual can opener',
            'Calculate: 2000 calories per person per day minimum'
          ]
        },
        {
          id: 'hunting-trapping',
          title: 'Basic Hunting & Trapping',
          priority: 'medium',
          steps: [
            'Know local wildlife laws when applicable',
            'Simple snares: wire loop on animal trail',
            'Deadfall traps: heavy weight triggered by bait',
            'Fish are often easier to catch than animals',
            'Improvised fishing: bent pin, thread, worms',
            'Check traps morning and evening',
            'Process catch quickly - meat spoils fast',
            'Cook all meat thoroughly to kill parasites',
            'Preserve extra: smoking, drying, salting',
            'Use all parts: bones for tools, sinew for cord'
          ]
        }
      ]
    },
    communication: {
      id: 'communication',
      title: 'Communication',
      icon: 'Radio',
      color: '#FF9500',
      guides: [
        {
          id: 'signaling',
          title: 'Signaling for Rescue',
          priority: 'critical',
          steps: [
            'Signal in threes: three fires, three whistle blasts = distress',
            'Use mirrors to flash at aircraft - can be seen for miles',
            'Make ground signals visible from air: X = need help',
            'Bright colors contrast with environment',
            'Smoke signals: add green vegetation for white smoke',
            'Fire at night, smoke during day',
            'Stay near your signal location',
            'Whistle carries farther than voice and saves energy',
            'Use flashlight or phone screen at night',
            'Signal at regular intervals - rescuers listen for patterns'
          ]
        },
        {
          id: 'morse-code',
          title: 'Morse Code Basics',
          priority: 'high',
          steps: [
            'SOS: ··· --- ··· (three short, three long, three short)',
            'A: ·−   B: −···   C: −·−·   D: −··',
            'E: ·    F: ··−·   G: −−·    H: ····',
            'I: ··   J: ·−−−   K: −·−    L: ·−··',
            'M: −−   N: −·     O: −−−    P: ·−−·',
            'Q: −−·− R: ·−·    S: ···    T: −',
            'U: ··−  V: ···−   W: ·−−    X: −··−',
            'Y: −·−− Z: −−··',
            'Use any method: light, sound, tapping',
            'Practice SOS until automatic'
          ]
        },
        {
          id: 'radio-communication',
          title: 'Emergency Radio Use',
          priority: 'high',
          steps: [
            'Keep emergency radio with fresh batteries',
            'Know local emergency frequencies',
            'Channel 9 on CB radio is emergency channel',
            'Channel 16 on marine radio is distress channel',
            'Speak clearly and slowly',
            'Give location, situation, number of people',
            'Say "MAYDAY" three times for life-threatening emergency',
            'Say "PAN PAN" for urgent but not life-threatening',
            'Listen more than transmit - save battery',
            'Have backup power: solar charger, hand crank'
          ]
        }
      ]
    },
    navigation: {
      id: 'navigation',
      title: 'Navigation',
      icon: 'Compass',
      color: '#5856D6',
      guides: [
        {
          id: 'compass-use',
          title: 'Compass Navigation',
          priority: 'high',
          steps: [
            'Hold compass flat and level',
            'Let needle settle - it points to magnetic north',
            'Rotate dial until N aligns with needle',
            'Direction of travel arrow shows your heading',
            'Remember: magnetic north differs from true north',
            'Take bearing: point direction arrow at target, read number',
            'Follow bearing: keep needle aligned with N while walking',
            'Triangulate position using two landmarks',
            'Keep compass away from metal objects',
            'Practice before you need it'
          ]
        },
        {
          id: 'natural-navigation',
          title: 'Navigation Without Compass',
          priority: 'high',
          steps: [
            'Sun rises in east, sets in west',
            'At noon in Northern Hemisphere, sun is due south',
            'Shadow stick: plant stick, mark shadow tip, wait 15 min, mark again',
            'Line between marks runs east-west (first mark is west)',
            'North Star (Polaris): find Big Dipper, follow outer edge stars up',
            'Moss often grows on north side of trees (less reliable)',
            'Snow melts faster on south-facing slopes',
            'Church altars traditionally face east',
            'Satellite dishes often point south (Northern Hemisphere)',
            'Watch method: point hour hand at sun, south is halfway to 12'
          ]
        },
        {
          id: 'map-reading',
          title: 'Map Reading Basics',
          priority: 'medium',
          steps: [
            'Orient map: align map north with compass north',
            'Identify your location using landmarks',
            'Contour lines show elevation - close lines = steep terrain',
            'Blue = water, Green = vegetation, Brown = elevation',
            'Scale: understand distance (1:25000 means 1cm = 250m)',
            'Plan route avoiding hazards: cliffs, rivers, restricted areas',
            'Identify checkpoints along route',
            'Estimate travel time: 4km/hour on flat, less for hills',
            'Have alternate routes planned',
            'Keep map protected from water'
          ]
        }
      ]
    }
  }
};

// Get guides for a specific language, fallback to English
export const getGuides = (lang = 'en') => {
  return survivalGuides[lang] || survivalGuides.en;
};

// Search guides by keyword
export const searchGuides = (guides, query) => {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  Object.values(guides).forEach(category => {
    category.guides.forEach(guide => {
      const titleMatch = guide.title.toLowerCase().includes(lowerQuery);
      const stepsMatch = guide.steps.some(step => 
        step.toLowerCase().includes(lowerQuery)
      );
      
      if (titleMatch || stepsMatch) {
        results.push({
          ...guide,
          category: category.title,
          categoryId: category.id,
          categoryIcon: category.icon,
          categoryColor: category.color
        });
      }
    });
  });
  
  return results;
};
