import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Translate = ({ text, targetLang }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      if (!text) return;
      setLoading(true);
      try {
        const response = await axios.post('https://libretranslate.com/translate', {
          q: text,
          source: 'en', 
          target: targetLang, 
          format: 'text',
        });
        setTranslatedText(response.data.translatedText);
      } catch (error) {
        console.error('Error translating text:', error);
        setTranslatedText(text);
      } finally {
        setLoading(false);
      }
    };

    translateText();
  }, [text, targetLang]);

  return <span>{loading ? 'Loading...' : translatedText || text}</span>;
};

export default Translate;