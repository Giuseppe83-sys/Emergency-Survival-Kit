import React from 'react';
import { useLanguageContext } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';

const LanguageSelector = () => {
  const { language, setLanguage, supportedLanguages } = useLanguageContext();

  const currentLang = supportedLanguages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-12 w-12 bg-[#111111] border-[#333333] hover:border-white hover:bg-[#1A1A1A]"
          data-testid="language-selector-trigger"
        >
          <Globe size={20} className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-[#111111] border-[#333333] min-w-[160px]"
      >
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer ${
              language === lang.code 
                ? 'text-[#FF3B30] bg-[#1A1A1A]' 
                : 'text-white hover:bg-[#1A1A1A]'
            }`}
            data-testid={`language-option-${lang.code}`}
          >
            <span className="font-medium">{lang.name}</span>
            {language === lang.code && <Check size={16} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
