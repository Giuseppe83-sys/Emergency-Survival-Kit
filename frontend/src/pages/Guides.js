import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguageContext } from '../context/LanguageContext';
import { survivalGuides, searchGuides } from '../data/survivalGuides';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Search, 
  ChevronRight, 
  Heart, 
  Droplets, 
  AlertTriangle, 
  Home, 
  Leaf, 
  Radio, 
  Compass,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const iconMap = {
  Heart,
  Droplets,
  AlertTriangle,
  Home,
  Leaf,
  Radio,
  Compass
};

const Guides = () => {
  const { t, language } = useLanguageContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = survivalGuides.en; // Using English guides as base

  const categories = useMemo(() => {
    return Object.values(guides).map(cat => ({
      ...cat,
      IconComponent: iconMap[cat.icon] || Heart
    }));
  }, [guides]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchGuides(guides, searchQuery);
  }, [guides, searchQuery]);

  const renderCategoryList = () => (
    <div className="grid grid-cols-1 gap-3 p-4">
      {categories.map((category) => {
        const IconComponent = category.IconComponent;
        return (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            data-testid={`category-${category.id}`}
            className="flex items-center gap-4 p-4 bg-[#111111] border border-[#333333] hover:border-white transition-all active:scale-[0.98] text-left"
          >
            <div 
              className="w-14 h-14 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: category.color }}
            >
              <IconComponent size={28} strokeWidth={2} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                {t(category.id.replace('-', ''))} 
              </h3>
              <p className="text-sm text-[#A1A1AA] mt-1">
                {category.guides.length} {t('guides').toLowerCase()}
              </p>
            </div>
            <ChevronRight size={24} className="text-[#52525B]" />
          </button>
        );
      })}
    </div>
  );

  const renderGuidesList = () => {
    if (!selectedCategory) return null;
    const IconComponent = selectedCategory.IconComponent;

    return (
      <div className="p-4">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setExpandedGuide(null);
          }}
          className="flex items-center gap-2 text-[#A1A1AA] hover:text-white mb-4 transition-colors"
          data-testid="back-to-categories"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-wider font-bold">Back</span>
        </button>

        <div 
          className="flex items-center gap-4 mb-6 p-4 border-b border-[#333333]"
          style={{ borderLeftColor: selectedCategory.color, borderLeftWidth: 4 }}
        >
          <div 
            className="w-12 h-12 flex items-center justify-center"
            style={{ backgroundColor: selectedCategory.color }}
          >
            <IconComponent size={24} strokeWidth={2} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            {t(selectedCategory.id.replace('-', ''))}
          </h2>
        </div>

        <div className="space-y-3">
          {selectedCategory.guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-[#111111] border border-[#333333] overflow-hidden"
            >
              <button
                onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                data-testid={`guide-${guide.id}`}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-3 h-3 ${
                      guide.priority === 'critical' ? 'bg-[#FF3B30]' :
                      guide.priority === 'high' ? 'bg-[#FF9500]' : 'bg-[#34C759]'
                    }`}
                  />
                  <span className="font-bold text-white">{guide.title}</span>
                </div>
                {expandedGuide === guide.id ? (
                  <ChevronUp size={20} className="text-[#A1A1AA]" />
                ) : (
                  <ChevronDown size={20} className="text-[#A1A1AA]" />
                )}
              </button>
              
              {expandedGuide === guide.id && (
                <div className="px-4 pb-4 border-t border-[#333333]">
                  <div className="pt-4 space-y-3">
                    {guide.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex gap-3"
                        data-testid={`guide-step-${index}`}
                      >
                        <span 
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: selectedCategory.color,
                            color: 'white'
                          }}
                        >
                          {index + 1}
                        </span>
                        <p className="text-[#A1A1AA] text-sm leading-relaxed pt-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    return (
      <div className="p-4">
        <p className="text-sm text-[#A1A1AA] mb-4 uppercase tracking-wider">
          {searchResults.length} results found
        </p>
        <div className="space-y-3">
          {searchResults.map((result) => (
            <div
              key={`${result.categoryId}-${result.id}`}
              className="bg-[#111111] border border-[#333333] p-4"
              data-testid={`search-result-${result.id}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-2 h-2"
                  style={{ backgroundColor: result.categoryColor }}
                />
                <span className="text-xs text-[#52525B] uppercase tracking-wider">
                  {result.category}
                </span>
              </div>
              <h3 className="font-bold text-white mb-2">{result.title}</h3>
              <p className="text-sm text-[#A1A1AA] line-clamp-2">
                {result.steps[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24" data-testid="guides-page">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 px-4 pt-6 pb-4 border-b border-[#333333]">
        <h1 
          className="text-2xl font-bold uppercase tracking-tight mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {t('survivalGuides')}
        </h1>
        
        {/* Search */}
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#52525B]" 
          />
          <Input
            type="text"
            placeholder={t('searchGuides')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="guides-search-input"
            className="w-full h-14 pl-12 pr-4 bg-black border-2 border-[#333333] text-white text-lg placeholder:text-[#52525B] focus:border-white focus:ring-0 rounded-none"
          />
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        {searchQuery.trim() ? (
          renderSearchResults()
        ) : selectedCategory ? (
          renderGuidesList()
        ) : (
          renderCategoryList()
        )}
      </ScrollArea>
    </div>
  );
};

export default Guides;
