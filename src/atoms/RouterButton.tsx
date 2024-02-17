import styles from 'lib/colours.module.css';
import { useNavigate } from 'react-router-dom';

interface Props {
    button_text: string
    route: string
}

const RouterButton: React.FC<Props> = ({ button_text, route }) => {
    const navigate = useNavigate();

    const goToRoute = () => {
        navigate(route);
    }

    return (
        <button className={ `btn ${ styles.blueWithHover } mt-4 mb-4 w-full text-xl text-white` } onClick={ goToRoute }> { button_text } </button>
    )
}

export default RouterButton;
