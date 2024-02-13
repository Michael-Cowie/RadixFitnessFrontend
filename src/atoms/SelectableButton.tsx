interface Props {
    selected: boolean,
    displayText: string,
    onClick: () => void;
}

const SelectableButton: React.FC<Props> = ({ selected, displayText, onClick}) => {
    const colour = selected ? 'rgb(53, 162, 235)' : "#a9a9a9";
    return (
        <button className="btn mr-4 w-20" style={{backgroundColor: colour}} onClick={ onClick }>
            { displayText }
        </button>
    )
}

export default SelectableButton;
