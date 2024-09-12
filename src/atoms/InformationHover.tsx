interface Props {
    information: string,
    faded?: boolean,
}

const InformationHover: React.FC<Props> = ({ information, faded=false }) => {
    return (
        <>
            <img 
                className = { `h-4 w-4 ${ faded ? 'opacity-40' : '' }` }
                src="information-icon.svg"
                title={ faded ? '' : information }
            />
        </>
    )
}

export default InformationHover;
