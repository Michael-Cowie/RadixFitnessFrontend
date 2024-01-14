interface Props {
    label: string;
}

export const FlexingArmButton: React.FC<Props> = ({ label }) => {
    return (
        <button className="btn btn-primary w-full font-sans font-black" type="submit"> 
            { label }
            <img width="25px" src="./flexing_arm.svg"/>
        </button>
    );
  };



  