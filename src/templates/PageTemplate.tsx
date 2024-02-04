import Footer from 'organisms/Footer';
import NavBar from 'organisms/NavBar';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const PageTemplate: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <NavBar/>

            { children }

            <Footer/>
        </div>
    )

}

export default PageTemplate;
