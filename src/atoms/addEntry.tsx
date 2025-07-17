import React from 'react';

interface AddEntryProps {
  onClick: () => void;
}

const AddEntry: React.FC<AddEntryProps> = ({ onClick } ) => {
    return (
      <div className="w-full h-full">
        <img title="Add an entry" src="/add_weight_icon.png" onClick={() => onClick()} />
      </div>
    )
  };

export default AddEntry;
