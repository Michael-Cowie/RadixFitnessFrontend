interface EqualWidthContainerProps {
  children: React.ReactNode;
  width: string; // e.g., "80%" or "300px"
}

import React from 'react';

interface EqualWidthContainerProps {
  /**
   * The content to be rendered inside the container.
   * These children should have width: 100% to match the container width.
   */
  children: React.ReactNode;

  /**
   * The desired width of the container.
   * Accepts any valid CSS width value such as "80%", "300px", "40rem", etc.
   */
  width: string;
}

/**
 * EqualWidthContainer is a layout utility component used to wrap other components
 * that are styled with `width: 100%`. It ensures a consistent outer width for its
 * children, making it easy to create fluid, responsive layouts.
 */
const EqualWidthContainer: React.FC<EqualWidthContainerProps> = ({ children, width }) => {
  const containerStyle: React.CSSProperties = {
    width,
  };

  return <div style={containerStyle}> {children} </div>;
};

export default EqualWidthContainer;
