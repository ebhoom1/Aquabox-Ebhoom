import React, { useState, useEffect } from 'react';
import './CustomBanner.css';

const CustomBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
    const isAndroidDevice = /android/.test(userAgent);

    if (isIOS && !isInStandaloneMode) {
      setIsVisible(true);
    } else if (isAndroidDevice && !isInStandaloneMode) {
      setIsVisible(true);
      setIsAndroid(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="custom-banner">
        {isAndroid ? (
          <p>Install this app on your device: tap the menu button and then "Add to Home screen".</p>
        ) : (
          <p>Install this app on your device: tap the share icon and then "Add to Home Screen".</p>
        )}
        <button onClick={handleClose}>Close</button>
      </div>
    )
  );
};

export default CustomBanner;
