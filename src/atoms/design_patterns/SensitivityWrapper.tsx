import React from 'react';

interface Props {
  sensitive: boolean;
  children: React.ReactNode;
}

const SensitivityController: React.FC<Props> = ({ children, sensitive=true}) => {
  const opacity = sensitive ? 'opacity-100': 'opacity-40' ;
  const pointerEvents = sensitive ? 'pointer-events-auto': 'pointer-events-none';

  return (
    <div className={`${opacity} ${pointerEvents}`}>
      {children}
    </div>
  );
};

export default SensitivityController;
