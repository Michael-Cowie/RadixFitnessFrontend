import React from 'react';

interface CheckBoxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
  name?: string;
}
const CheckBoxWithLabel: React.FC<CheckBoxProps> = ({
  label,
  checked,
  onChange,
  name,
  defaultChecked,
}) => {
  return (
    <label className="flex items-center select-none cursor-pointer">
      <input
        className="mr-1"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        defaultChecked={defaultChecked}
      />
      <span> {label} </span>
    </label>
  );
};

export default CheckBoxWithLabel;
