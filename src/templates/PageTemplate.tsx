import { ReactNode } from 'react';

import NavBar from "organisms/NavBar";
import Footer from "organisms/Footer";

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