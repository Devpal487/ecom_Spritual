import React from 'react';
import { useLanguage } from './LanguageContext'; 

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLanguage(); 

  const handleLanguageChange = (e) => {
    switchLanguage(e.target.value); // Switch language on change
  };

  return (
    <div className="language-switcher text-black bg-transparent">
      <select value={language} onChange={handleLanguageChange} className="bg-transparent text-black p-2 border rounded-md">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        {/* Add more languages as needed */}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
