import LoadingButton from 'atoms/LoadingButton';
import useWeightTrackingGraphContext from 'context/WeightTrackingGraphContext/WeightTrackingGraphContext';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode
}

const WeightTrackingPageLoadingHandler: React.FC<Props> = ({ children }) => {
    const { isLoading } = useWeightTrackingGraphContext();

    if ( isLoading ) {
        return (
            <>
                <div className="w-5/6 md:w-1/6">
                    <LoadingButton buttonText='' displayLoadingAnimation={true} />
                </div>
            </>
        );
    }

    return (
        <>
            { children }
        </>
    )
}

export default WeightTrackingPageLoadingHandler