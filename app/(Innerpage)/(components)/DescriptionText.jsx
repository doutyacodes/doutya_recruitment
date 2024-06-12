import React from 'react';

const DescriptionText = ({ rules }) => {
  return (
    
      <div
        dangerouslySetInnerHTML={{ __html: rules }}
      />
  );
};

export default DescriptionText;
