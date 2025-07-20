import React, { useEffect, useRef, useState } from 'react';

interface CenteringContainerProps {
  children: React.ReactNode;
}

/**
 * Core application centering component. This component is used to vertically and horizontally center all
 * pages that use it. The resize observer is required for flex-items, as when a flex-item is larger
 * than the flex-container, the centering is not within the scrollarea. Therefore, dynamically adjust
 * the justify-start and justify-center depending if the scrollarea is enabled.
 */
const HorizontalVerticalCenteringContainer: React.FC<CenteringContainerProps> = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /*
      scrollHeight = This is the total height of the content inside an element, including the content not visible on the screen due to overflow.
      clientHeight = This is the height of the visible content inside an element, i.e., the portion of the element that is visible within the viewport, 
                     excluding the content that is hidden because of scrolling.
    */
    const element = containerRef.current;

    const checkOverflow = () => {
      if (element) {
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-1 flex-col h-full w-full overflow-auto items-center ${isOverflowing ? 'justify-start' : 'justify-center'}`}
    >
      {children}
    </div>
  );
};

export default HorizontalVerticalCenteringContainer;
