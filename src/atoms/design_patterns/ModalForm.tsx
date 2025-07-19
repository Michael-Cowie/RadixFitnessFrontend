import { SyntheticEvent, ReactNode } from 'react';
import HorizontalVerticalCenteringContainer from 'atoms/design_patterns/CenterContainer';

interface ModalFormProps {
    onSubmit: (e: SyntheticEvent) => void;
    closeModalWindow: () => void;
    children: ReactNode;
}

const ModalForm: React.FC<ModalFormProps> = ({
    onSubmit,
    closeModalWindow,
    children
}) => {
    return (
        <dialog id={'modal-dialog'} className={`modal modal-open`}>
            <div className="modal-box ">
                <HorizontalVerticalCenteringContainer>
                    <form onSubmit={onSubmit} className="w-full max-w-xs">
                        <button
                            type="button"
                            onClick={closeModalWindow}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>

                        {children}
                    </form>
                </HorizontalVerticalCenteringContainer>
            </div>
        </dialog>
    );
};

export default ModalForm;
