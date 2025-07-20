interface Props {
  information: string;
}

const InformationHover: React.FC<Props> = ({ information }) => {
  return (
    <>
      <img className={`h-4 w-4}`} src="/information-icon.svg" title={information} />
    </>
  );
};

export default InformationHover;
