export const goBagItems = {
  essentials: {
    id: 'essentials',
    name: 'Essentials',
    icon: 'Package',
    items: [
      { id: 'e1', name: 'Backpack (30-50L)', checked: false },
      { id: 'e2', name: 'Flashlight + spare batteries', checked: false },
      { id: 'e3', name: 'Multi-tool or knife', checked: false },
      { id: 'e4', name: 'Fire starter (lighter, matches, ferro rod)', checked: false },
      { id: 'e5', name: 'Whistle', checked: false },
      { id: 'e6', name: 'Paracord (50 ft minimum)', checked: false },
      { id: 'e7', name: 'Duct tape', checked: false },
      { id: 'e8', name: 'Cash (small bills)', checked: false }
    ]
  },
  water: {
    id: 'water',
    name: 'Water',
    icon: 'Droplets',
    items: [
      { id: 'w1', name: 'Water bottles (3L minimum)', checked: false },
      { id: 'w2', name: 'Water purification tablets', checked: false },
      { id: 'w3', name: 'Portable water filter', checked: false },
      { id: 'w4', name: 'Collapsible water container', checked: false }
    ]
  },
  food: {
    id: 'food',
    name: 'Food',
    icon: 'UtensilsCrossed',
    items: [
      { id: 'f1', name: 'Energy bars (3-day supply)', checked: false },
      { id: 'f2', name: 'Dried food/MREs', checked: false },
      { id: 'f3', name: 'Nuts and trail mix', checked: false },
      { id: 'f4', name: 'Mess kit or spork', checked: false },
      { id: 'f5', name: 'Portable stove + fuel', checked: false }
    ]
  },
  medical: {
    id: 'medical',
    name: 'Medical',
    icon: 'Heart',
    items: [
      { id: 'm1', name: 'First aid kit', checked: false },
      { id: 'm2', name: 'Prescription medications (7-day supply)', checked: false },
      { id: 'm3', name: 'Pain relievers', checked: false },
      { id: 'm4', name: 'Bandages and gauze', checked: false },
      { id: 'm5', name: 'Tourniquet', checked: false },
      { id: 'm6', name: 'Medical tape', checked: false },
      { id: 'm7', name: 'Antiseptic wipes', checked: false },
      { id: 'm8', name: 'Tweezers', checked: false },
      { id: 'm9', name: 'Sunscreen', checked: false },
      { id: 'm10', name: 'Insect repellent', checked: false }
    ]
  },
  tools: {
    id: 'tools',
    name: 'Tools',
    icon: 'Wrench',
    items: [
      { id: 't1', name: 'Hand-crank or solar radio', checked: false },
      { id: 't2', name: 'Compass', checked: false },
      { id: 't3', name: 'Local maps', checked: false },
      { id: 't4', name: 'Sewing kit', checked: false },
      { id: 't5', name: 'Zip ties', checked: false },
      { id: 't6', name: 'Work gloves', checked: false },
      { id: 't7', name: 'N95 masks', checked: false },
      { id: 't8', name: 'Safety goggles', checked: false }
    ]
  },
  documents: {
    id: 'documents',
    name: 'Documents',
    icon: 'FileText',
    items: [
      { id: 'd1', name: 'ID copies (waterproof)', checked: false },
      { id: 'd2', name: 'Emergency contact list', checked: false },
      { id: 'd3', name: 'Insurance documents', checked: false },
      { id: 'd4', name: 'Medical records', checked: false },
      { id: 'd5', name: 'Pen and notepad', checked: false },
      { id: 'd6', name: 'USB with important files', checked: false }
    ]
  },
  clothing: {
    id: 'clothing',
    name: 'Clothing',
    icon: 'Shirt',
    items: [
      { id: 'c1', name: 'Change of clothes', checked: false },
      { id: 'c2', name: 'Rain poncho', checked: false },
      { id: 'c3', name: 'Warm layer / fleece', checked: false },
      { id: 'c4', name: 'Sturdy boots', checked: false },
      { id: 'c5', name: 'Hat', checked: false },
      { id: 'c6', name: 'Bandana / shemagh', checked: false },
      { id: 'c7', name: 'Extra socks', checked: false }
    ]
  }
};

export const getCategoryIcon = (categoryId) => {
  const icons = {
    essentials: 'Package',
    water: 'Droplets',
    food: 'UtensilsCrossed',
    medical: 'Heart',
    tools: 'Wrench',
    documents: 'FileText',
    clothing: 'Shirt',
    custom: 'Plus'
  };
  return icons[categoryId] || 'Package';
};

export const getDefaultItems = () => {
  const items = {};
  Object.entries(goBagItems).forEach(([key, category]) => {
    items[key] = category.items.map(item => ({ ...item }));
  });
  return items;
};
