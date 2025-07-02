import styles from 'lib/colours.module.css';

import LinearProgress from '@mui/material/LinearProgress';

interface Props {
    buttonText: string,
    displayLoadingAnimation: boolean
    displayIcon?: boolean
}


const LoadingButton: React.FC<Props> = ({ buttonText, displayLoadingAnimation, displayIcon=false }) => {
  
    return (
        <button 
            className={ `btn ${ styles.orangeWithHover } w-full font-sans font-black` } 
            type="submit"
        >
            { displayLoadingAnimation ? (
                <LinearProgress 
                    className="absolute w-full"
                />
            ) : (
                <>
                    { buttonText } { displayIcon && <img width="25px" src="flexing_arm.svg"/> }
                </>
            ) }
        </button>
    );
};
export default LoadingButton;
