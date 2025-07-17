import React from 'react';

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center select-none cursor-pointer">
      <input
        className="mr-1"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span> { label } </span>
    </label>
  );
};

export default CheckBox;
