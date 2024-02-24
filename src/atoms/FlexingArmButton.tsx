interface Props {
    label: string;
}

import styles from 'lib/colours.module.css';

export const FlexingArmButton: React.FC<Props> = ({ label }) => {
    return (
        <button className={ `btn ${ styles.blueWithHover } w-full font-sans font-black` } type="submit"> 
            { label }
            <img width="25px" src="public/flexing_arm.svg"/>
        </button>
    );
};
