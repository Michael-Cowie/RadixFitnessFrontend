import SubmitButtonWithProgress from 'atoms/design_patterns/SubmitButtonWithProgress';
import React, { ReactNode } from 'react';

interface GroupProps {
    title: string;
    children: ReactNode;
}

interface GroupContainerProps {
    children: ReactNode;
}

interface SubmitButton {
    displayLoadingAnimation: boolean;
}

export const GroupContainer: React.FC<GroupContainerProps> = ({ children }) => {
    return (
        <div className='flex flex-col space-y-2'>
            { children }
        </div>
    )
}

export const Group: React.FC<GroupProps> = ({ title, children}) => {
  return (
    <div className='flex flex-col'>
        <div className="font-bold text-left"> { title } </div>
        <div className="ml-2">
            { children }
        </div>
    </div>
  );
};

export const SubmitButton: React.FC<SubmitButton> = ({ displayLoadingAnimation }) => {
    return (
        <div className='w-full flex justify-end'>
            <div className='w-24'>
                <SubmitButtonWithProgress
                    buttonText="Submit"
                    displayLoadingAnimation={ displayLoadingAnimation }
                />
            </div>
        </div>
    )
}