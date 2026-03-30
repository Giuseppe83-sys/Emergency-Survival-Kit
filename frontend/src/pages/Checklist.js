import React, { useState, useMemo, useEffect } from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { goBagItems, getDefaultItems, getCategoryIcon } from '../data/goBagItems';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Package, 
  Droplets, 
  UtensilsCrossed, 
  Heart, 
  Wrench, 
  FileText, 
  Shirt,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const iconMap = {
  Package,
  Droplets,
  UtensilsCrossed,
  Heart,
  Wrench,
  FileText,
  Shirt,
  Plus
};

const Checklist = () => {
  const { t } = useLanguageContext();
  const [checklist, setChecklist] = useLocalStorage('survival-kit-checklist', null);
  const [customItems, setCustomItems] = useLocalStorage('survival-kit-custom-items', []);
  const [expandedCategories, setExpandedCategories] = useState(['essentials']);
  const [newItemText, setNewItemText] = useState('');

  // Initialize checklist with default items if not set
  useEffect(() => {
    if (checklist === null) {
      setChecklist(getDefaultItems());
    }
  }, [checklist, setChecklist]);

  const categories = useMemo(() => {
    if (!checklist) return [];
    
    const cats = Object.entries(goBagItems).map(([key, category]) => ({
      ...category,
      items: checklist[key] || category.items,
      IconComponent: iconMap[getCategoryIcon(key)] || Package
    }));

    // Add custom items category if there are custom items
    if (customItems.length > 0) {
      cats.push({
        id: 'custom',
        name: t('custom'),
        items: customItems,
        IconComponent: Plus
      });
    }

    return cats;
  }, [checklist, customItems, t]);

  const progress = useMemo(() => {
    if (!checklist) return { checked: 0, total: 0, percentage: 0 };
    
    let total = 0;
    let checked = 0;

    Object.values(checklist).forEach(items => {
      items.forEach(item => {
        total++;
        if (item.checked) checked++;
      });
    });

    customItems.forEach(item => {
      total++;
      if (item.checked) checked++;
    });

    return {
      checked,
      total,
      percentage: total > 0 ? Math.round((checked / total) * 100) : 0
    };
  }, [checklist, customItems]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleItem = (categoryId, itemId) => {
    if (categoryId === 'custom') {
      setCustomItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      );
    } else {
      setChecklist(prev => ({
        ...prev,
        [categoryId]: prev[categoryId].map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }));
    }
  };

  const addCustomItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: `custom-${Date.now()}`,
      name: newItemText.trim(),
      checked: false
    };
    
    setCustomItems(prev => [...prev, newItem]);
    setNewItemText('');
    
    if (!expandedCategories.includes('custom')) {
      setExpandedCategories(prev => [...prev, 'custom']);
    }
  };

  const removeCustomItem = (itemId) => {
    setCustomItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearAll = () => {
    setChecklist(getDefaultItems());
    setCustomItems([]);
  };

  if (!checklist) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-[#A1A1AA]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="checklist-page">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 px-4 pt-6 pb-4 border-b border-[#333333]">
        <div className="flex items-center justify-between mb-4">
          <h1 
            className="text-2xl font-bold uppercase tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {t('goBagChecklist')}
          </h1>
          <button
            onClick={clearAll}
            className="text-xs text-[#FF3B30] uppercase tracking-wider font-bold hover:text-[#FF5249] transition-colors"
            data-testid="clear-all-btn"
          >
            {t('clearAll')}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#A1A1AA] uppercase tracking-wider">{t('progress')}</span>
            <span className="font-bold font-mono">{progress.checked}/{progress.total}</span>
          </div>
          <Progress 
            value={progress.percentage} 
            className="h-3 bg-[#333333]"
            data-testid="checklist-progress"
          />
        </div>

        {/* Add Custom Item */}
        <div className="flex gap-2 mt-4">
          <Input
            type="text"
            placeholder={t('addCustomItem')}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            data-testid="add-custom-input"
            className="flex-1 h-14 px-4 bg-black border-2 border-[#333333] text-white placeholder:text-[#52525B] focus:border-white focus:ring-0 rounded-none"
          />
          <button
            onClick={addCustomItem}
            disabled={!newItemText.trim()}
            data-testid="add-custom-btn"
            className="h-14 w-14 bg-[#FF3B30] text-white flex items-center justify-center hover:bg-[#FF5249] disabled:bg-[#333333] disabled:text-[#52525B] transition-colors"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Categories */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="p-4 space-y-3">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const IconComponent = category.IconComponent;
            const checkedCount = category.items.filter(i => i.checked).length;

            return (
              <div 
                key={category.id}
                className="bg-[#111111] border border-[#333333] overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  data-testid={`category-toggle-${category.id}`}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center">
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold uppercase tracking-wide text-white">
                        {category.name}
                      </span>
                      <span className="text-xs text-[#52525B] ml-2">
                        {checkedCount}/{category.items.length}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-[#A1A1AA]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#A1A1AA]" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-[#333333]">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#1A1A1A] transition-colors border-b border-[#222222] last:border-b-0"
                      >
                        <label 
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          data-testid={`checklist-item-${item.id}`}
                        >
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(category.id, item.id)}
                            className="w-6 h-6 border-2 border-[#333333] data-[state=checked]:bg-[#34C759] data-[state=checked]:border-[#34C759]"
                          />
                          <span className={`text-sm ${item.checked ? 'text-[#52525B] line-through' : 'text-white'}`}>
                            {item.name}
                          </span>
                        </label>
                        {category.id === 'custom' && (
                          <button
                            onClick={() => removeCustomItem(item.id)}
                            className="p-2 text-[#52525B] hover:text-[#FF3B30] transition-colors"
                            data-testid={`remove-item-${item.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Checklist;
