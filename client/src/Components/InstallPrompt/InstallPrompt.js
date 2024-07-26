// client/src/components/InstallPrompt.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const InstallPrompt = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the install prompt has already been shown
    const installPromptShown = localStorage.getItem('installPromptShown');
    if (installPromptShown) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      window.deferredPrompt = null;
      setIsOpen(false);
      // Set the flag in localStorage
      localStorage.setItem('installPromptShown', 'true');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Set the flag in localStorage
    localStorage.setItem('installPromptShown', 'true');
  };

  return (
    <Modal isOpen={modalIsOpen}
     onRequestClose={closeModal}
      contentLabel="Install App Prompt"
       ariaHideApp={false}
       style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        },
      }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Install Our App</h2>
        <p>Install this app on your device for a better experience.</p>
        <button className="btn btn-primary mt-2 mr-2" onClick={handleInstallClick}>Install</button>
        <button className="btn btn-danger mt-2 mr-2" onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default InstallPrompt;
