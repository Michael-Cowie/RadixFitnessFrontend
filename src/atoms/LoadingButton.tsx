import styles from 'lib/colours.module.css';

interface Props {
    buttonText: string,
    displayLoadingAnimation: boolean
    displayIcon?: boolean
}

const LoadingButton: React.FC<Props> = ({ buttonText, displayLoadingAnimation, displayIcon=false }) => {
  
    return (
        <button 
            className={ `btn ${ styles.blueWithHover } w-full font-sans font-black` } 
            type='submit'
        >
            {displayLoadingAnimation ? (
                <span className="loading loading-spinner loading-lg"/>
            ) : (
                <>
                    { buttonText } { displayIcon && <img width="25px" src="public/flexing_arm.svg"/> }
                </>
            )}
        </button>
    );
  };
export default LoadingButton;
