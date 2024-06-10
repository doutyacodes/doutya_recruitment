"use client"
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        console.log('Before unload event triggered');
        const message = "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Example function to simulate unsaved changes
  const simulateChange = () => {
    setHasUnsavedChanges(true);
  };

  return (
    <div>
      <button onClick={simulateChange}>Simulate Change</button>
      {/* Your component JSX */}
      {hasUnsavedChanges && <p>You have unsaved changes!</p>}
    </div>
  );
};

export default MyComponent;
