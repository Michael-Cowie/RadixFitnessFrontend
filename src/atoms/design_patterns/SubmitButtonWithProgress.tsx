import styles from 'lib/colours.module.css';

import LinearProgress from '@mui/material/LinearProgress';

interface Props {
  buttonText: string;
  displayLoadingAnimation: boolean;
  iconSrc?: string;
}

const SubmitButtonWithProgress: React.FC<Props> = ({
  buttonText,
  displayLoadingAnimation,
  iconSrc,
}) => {
  return (
    <button className={`w-full btn ${styles.orangeWithHover} font-sans font-black`} type="submit">
      {displayLoadingAnimation ? (
        <LinearProgress className="absolute w-full" />
      ) : (
        <>
          {buttonText}

          {iconSrc && <img width="25px" src={iconSrc} alt="" className="ml-2 inline-block" />}
        </>
      )}
    </button>
  );
};
export default SubmitButtonWithProgress;
