import HorizontalVerticalCenteringContainer from 'atoms/design_patterns/CenterContainer';
import Footer from 'organisms/Footer';
import NavBar from 'organisms/NavBar';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const PageTemplate: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex flex-col h-full w-full">
            <NavBar/>

            <HorizontalVerticalCenteringContainer>
                { children }
            </HorizontalVerticalCenteringContainer>

            <Footer/>
        </div>
    )

}

export default PageTemplate;
