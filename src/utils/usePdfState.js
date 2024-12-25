import { useState } from 'react';

export const usePdfState = () => {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);

  return {
    numPages,
    scale,
    setNumPages,
    setScale,
  };
};