import { useNavigate } from "react-router-dom";

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
        <button className="btn btn-active btn-neutral mt-4 mb-4 w-full" onClick={ goToRoute }> { button_text } </button>
    )
}

export default RouterButton;
