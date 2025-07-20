import React from 'react';

import styles from './CircularBox.module.css';

interface CircularBoxProps {
  number: string;
  text: string;
  selected: boolean;
}

const CircularBox: React.FC<CircularBoxProps> = ({ number, text, selected }) => {
  return (
    <div
      className={`${styles.circularContainer} ${selected ? styles.selected : ''}`}
      style={{ userSelect: 'none' }}
    >
      <div className={styles.textTop}>{text}</div>
      <div className={styles.numberCircle}>{number}</div>
    </div>
  );
};

export default CircularBox;
