interface Props {
  selected: boolean;
  displayText: string;
  onClick: () => void;
  isDisabled?: boolean;
}

const SelectableButton: React.FC<Props> = ({
  selected,
  displayText,
  onClick,
  isDisabled = false,
}) => {
  const colour = selected ? 'var(--blue)' : '#a9a9a9';
  return (
    <button
      disabled={isDisabled}
      type="button"
      className="btn w-30 font-bold"
      style={{ backgroundColor: colour }}
      onClick={onClick}
    >
      {displayText}
    </button>
  );
};

export default SelectableButton;
