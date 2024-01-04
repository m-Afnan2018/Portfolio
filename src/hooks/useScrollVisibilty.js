// useScrollVisibility.js

import { useState, useEffect } from 'react';

const useScrollVisibility = (threshold = 100) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const isScrolledDown = scrolled > threshold;

    setIsVisible(isScrolledDown);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  },);

  return isVisible;
};

export default useScrollVisibility;
