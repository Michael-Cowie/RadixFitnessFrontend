import React, { useEffect, useRef, useState } from 'react';

interface CenteringContainerProps {
    children: React.ReactNode;
}

/**
 * Core application centering component. This component is used to vertically and horizontally center all
 * pages that use it. The resize listener is required for flex-items, as when a flex-item is larger
 * than the flex-container, the centering is not within the scrollarea. Therefore, dynamically adjust
 * the justify-start and justify-center depending if the scrollarea is enabled.
 */
const CompleteCenteringContainer: React.FC<CenteringContainerProps> = ({ children }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                setIsOverflowing(containerRef.current.scrollHeight > containerRef.current.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [children]);

    return (
        <div
            ref={containerRef}
            className={`flex flex-1 flex-col overflow-auto items-center ${isOverflowing ? 'justify-start' : 'justify-center'}`}
        >
            { children }
        </div>
    );
};

export default CompleteCenteringContainer;
